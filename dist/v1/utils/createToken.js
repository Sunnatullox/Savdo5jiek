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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAccessTokenAdministrator = exports.updateAccessTokenUser = exports.sendToken = exports.sendTokenAdmin = exports.refreshTokenOptions = exports.accessTokenOptions = exports.refreshTokenExpire = exports.accessTokenExpire = exports.createActivationToken = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const administration_service_1 = require("../services/administration.service");
const ErrorHandler_1 = __importDefault(require("../middleware/ErrorHandler"));
const db_1 = __importDefault(require("../config/db"));
const createActivationToken = (user) => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jsonwebtoken_1.default.sign({ user, activationCode }, process.env.ACTIVATION_TOKEN_SECRET, {
        expiresIn: "5m",
    });
    return { token, activationCode };
};
exports.createActivationToken = createActivationToken;
exports.accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "1440", // 1 day
10);
exports.refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "1440", // 1 day
10);
exports.accessTokenOptions = {
    expires: new Date(Date.now() + exports.accessTokenExpire * 24 * 60 * 60 * 1000), // 1 day
    maxAge: exports.accessTokenExpire * 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Cross-Site HTTP Only
    secure: process.env.NODE_ENV === "production", // Secure cookie
};
exports.refreshTokenOptions = {
    expires: new Date(Date.now() + exports.refreshTokenExpire * 24 * 60 * 60 * 1000), // 1 day
    maxAge: exports.refreshTokenExpire * 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
};
const sendTokenAdmin = (user, statusCode, res) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = yield (0, administration_service_1.signAccessToken)(user.id);
    const refreshToken = yield (0, administration_service_1.signRefreshToken)(user.id);
    const { password: _, twoFactorSecret: __ } = user, userData = __rest(user, ["password", "twoFactorSecret"]);
    if (process.env.NODE_ENV === "production") {
        exports.accessTokenOptions.secure = true;
        exports.refreshTokenOptions.secure = true;
    }
    res.cookie("access_token", accessToken, exports.accessTokenOptions);
    res.cookie("refresh_token", refreshToken, exports.refreshTokenOptions);
    res
        .status(statusCode)
        .json({ success: true, message: "Login successful", user: userData });
});
exports.sendTokenAdmin = sendTokenAdmin;
const sendToken = (user, statusCode, res) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = yield (0, administration_service_1.signAccessToken)(user.id);
    const refreshToken = yield (0, administration_service_1.signRefreshToken)(user.id);
    const _a = user, { user_id: _ } = _a, userData = __rest(_a, ["user_id"]);
    if (process.env.NODE_ENV === "production") {
        exports.accessTokenOptions.secure = true;
        exports.refreshTokenOptions.secure = true;
    }
    res.cookie("access_token", accessToken, exports.accessTokenOptions);
    res.cookie("refresh_token", refreshToken, exports.refreshTokenOptions);
    res
        .status(statusCode)
        .json({ success: true, message: "Login successful", user: userData });
});
exports.sendToken = sendToken;
exports.updateAccessTokenUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refresh_token = req.cookies.refresh_token;
        if (!refresh_token) {
            return next(new ErrorHandler_1.default("Please login to access this resource", 401));
        }
        const decoded = jsonwebtoken_1.default.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
        if (!decoded) {
            return next(new ErrorHandler_1.default("refresh token is not valid", 401));
        }
        const user = yield db_1.default.user.findUnique({
            where: {
                id: decoded.id,
            },
        });
        if (!user) {
            return next(new ErrorHandler_1.default("Please login to access this resource", 401));
        }
        const accessToken = yield (0, administration_service_1.signAccessToken)(user.id);
        const refreshToken = yield (0, administration_service_1.signRefreshToken)(user.id);
        req.user = user;
        // Set cookies before calling next()
        res.cookie("access_token", accessToken, exports.accessTokenOptions);
        res.cookie("refresh_token", refreshToken, exports.refreshTokenOptions);
        return next(); // Ensure no further response is sent after this
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler_1.default("Please login to access this resource", 401));
    }
}));
exports.updateAccessTokenAdministrator = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refresh_token = req.cookies.refresh_token;
        if (!refresh_token) {
            return next(new ErrorHandler_1.default("Please login to access this resource", 401));
        }
        const decoded = jsonwebtoken_1.default.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
        if (!decoded) {
            return next(new ErrorHandler_1.default("refresh token is not valid", 401));
        }
        const adminstrator = yield db_1.default.administration.findUnique({
            where: {
                id: decoded.id,
            },
        });
        if (!adminstrator) {
            return next(new ErrorHandler_1.default("Administrator not found", 404));
        }
        const accessToken = yield (0, administration_service_1.signAccessToken)(adminstrator.id);
        const refreshToken = yield (0, administration_service_1.signRefreshToken)(adminstrator.id);
        req.adminstrator = adminstrator;
        // Set cookies before calling next()
        res.cookie("access_token", accessToken, exports.accessTokenOptions);
        res.cookie("refresh_token", refreshToken, exports.refreshTokenOptions);
        return next(); // Ensure no further response is sent after this
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler_1.default("Please login to access this resource", 401));
    }
}));
