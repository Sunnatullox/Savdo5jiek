"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserDevice = exports.updateUserData = exports.getUser = exports.logout = exports.login = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ErrorHandler_1 = __importDefault(require("../middleware/ErrorHandler"));
const createToken_1 = require("../utils/createToken");
const request_ip_1 = __importDefault(require("request-ip"));
const express_useragent_1 = __importDefault(require("express-useragent"));
const user_service_1 = require("../services/user.service");
exports.login = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.headers["x_code"];
    const redirect_uri = process.env.ONE_ID_REDIRECT_URI;
    const ip = request_ip_1.default.getClientIp(req);
    const ua = express_useragent_1.default.parse(req.headers["user-agent"]);
    try {
        const accessTokenData = yield (0, user_service_1.getAccessToken)(code, redirect_uri);
        const userData = yield (0, user_service_1.getUserData)(accessTokenData.access_token);
        const user = yield (0, user_service_1.findOrCreateUser)(userData);
        yield (0, user_service_1.findOrCreateDevice)(user, ip || "", ua);
        yield (0, createToken_1.sendToken)(user, 200, res);
    }
    catch (error) {
        console.log("Login error", error);
        next(new ErrorHandler_1.default("Error processing Login please try again", 500));
    }
}));
exports.logout = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.status(200).json({
        message: "Logout successful",
        success: true,
    });
}));
exports.getUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return next(new ErrorHandler_1.default("Please login to access this route", 401));
        }
        const user = yield (0, user_service_1.getUserById)(req.user.id);
        res.status(200).json({
            message: "User fetched successfully",
            data: user,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.updateUserData = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { address = "", phone_number = "", oked = "", x_r = "", bank = "", mfo = "", } = req.body;
        if (!req.user) {
            return next(new ErrorHandler_1.default("Please login to access this route", 401));
        }
        const userWithLegal = req.user;
        if (userWithLegal.legal_info) {
            if (!address ||
                !phone_number ||
                !oked ||
                !x_r ||
                !bank ||
                !mfo) {
                return next(new ErrorHandler_1.default("Please fill all the fields", 400));
            }
            const updatedLegalInfo = yield (0, user_service_1.updateUserLegalInfo)(userWithLegal.id, {
                address,
                phone_number,
                oked,
                x_r,
                bank,
                mfo,
                tin: userWithLegal.legal_info.tin,
                inn: userWithLegal.legal_info.inn,
                le_name: userWithLegal.legal_info.le_name,
                name: userWithLegal.legal_info.name,
                organizationLeader: userWithLegal.full_name,
            });
            const updatedUser = yield (0, user_service_1.updateUser)(userWithLegal.id, {
                is_LLC: true,
            });
            res.status(200).json({
                message: "User updated successfully",
                data: {
                    user: updatedUser,
                    legal_info: updatedLegalInfo,
                },
            });
        }
        else {
            if (!address || !phone_number) {
                return next(new ErrorHandler_1.default("Please fill all the fields", 400));
            }
            const updatedUser = yield (0, user_service_1.updateUser)(req.user.id, {
                address,
                phone_number,
                is_LLC: false,
            });
            res.status(200).json({
                message: "User updated successfully",
                data: updatedUser,
            });
        }
    }
    catch (error) {
        console.log("Update user error", error);
        next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.deleteUserDevice = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const device_id = req.params.device_id;
        const findDevice = yield (0, user_service_1.findUserDeviceService)(device_id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        if (!findDevice) {
            return next(new ErrorHandler_1.default("Device not found", 400));
        }
        yield (0, user_service_1.deleteUserDeviceService)(device_id, (_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        res.status(200).json({
            success: true,
            message: "Device deleted successfully",
        });
    }
    catch (error) {
        console.log("Delete device error", error);
        next(new ErrorHandler_1.default(error.message, 500));
    }
}));
