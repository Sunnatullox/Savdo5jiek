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
exports.deleteAdminProfile = exports.deleteAdminDevice = exports.getAdminstratorInfo = exports.adminstratorTwoFactorAuthUpdateAndCreate = exports.adminstratorAddAndUpdateInfo = exports.adminstratorLogin = exports.adminstratorOTPVerify = exports.adminstratorOTP = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ErrorHandler_1 = __importDefault(require("../middleware/ErrorHandler"));
const db_1 = __importDefault(require("../config/db"));
const otp_generator_1 = __importDefault(require("otp-generator"));
const emailSender_1 = require("../utils/emailSender");
const emailAdminstratorTemp_1 = __importDefault(require("../gmail/emailAdminstratorTemp"));
const adminstration_service_1 = require("../services/adminstration.service");
const createToken_1 = require("../utils/createToken");
const bcryptjs_1 = require("bcryptjs");
const request_ip_1 = __importDefault(require("request-ip"));
const express_useragent_1 = __importDefault(require("express-useragent"));
exports.adminstratorOTP = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        // Delete old and unverified OTP records
        yield db_1.default.oTP.deleteMany({
            where: {
                expiresAt: { lt: new Date() },
                verified: false,
            },
        });
        if (!["admin", "tax_agent"].includes(req.query.type)) {
            return next(new ErrorHandler_1.default("Invalid type", 400));
        }
        const role = req.query.type === "admin" ? "ADMIN" : "TAX_AGENT";
        const checkAdmin = yield db_1.default.administration.findFirst({
            where: { role, email },
        });
        if (checkAdmin) {
            return next(new ErrorHandler_1.default("Admin already exists", 400));
        }
        const otp = otp_generator_1.default.generate(5, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        yield (0, emailSender_1.mailSender)(process.env.SENDER_EMAIL, "OTP Email Verification", (0, emailAdminstratorTemp_1.default)(otp, name, role));
        yield db_1.default.oTP.create({
            data: {
                email,
                user: { name, email, password, role },
                code: otp,
                type: role,
                expiresAt: new Date(Date.now() + 1000 * 60 * 5),
            },
        });
        res.status(200).json({
            success: true,
            message: "OTP sent to email",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.adminstratorOTPVerify = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        const role = req.query.type === "admin" ? "ADMIN" : "TAX_AGENT";
        const checkOTP = yield db_1.default.oTP.findFirst({
            where: {
                email,
                expiresAt: { gt: new Date() },
                verified: false,
                type: role,
            },
        });
        if (!checkOTP) {
            return next(new ErrorHandler_1.default("OTP not found", 400));
        }
        if (checkOTP.code !== otp) {
            return next(new ErrorHandler_1.default("Invalid OTP", 400));
        }
        if (checkOTP.expiresAt < new Date()) {
            yield db_1.default.oTP.delete({ where: { id: checkOTP.id } });
            return next(new ErrorHandler_1.default("OTP expired", 400));
        }
        const adminData = Object.assign(Object.assign({}, checkOTP.user), { isTwoFactorAuth: false, twoFactorSecret: "" });
        yield (0, adminstration_service_1.createAdministration)(adminData);
        yield db_1.default.oTP.delete({ where: { id: checkOTP.id } });
        res.status(200).json({
            success: true,
            message: "OTP verified and Administration created",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.adminstratorLogin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, twoFactorSecret } = req.body;
        const ip = request_ip_1.default.getClientIp(req);
        const ua = express_useragent_1.default.parse(req.headers["user-agent"]);
        const checkUser = (yield db_1.default.administration.findUnique({
            where: { email },
            include: { Device: true },
        }));
        if (!checkUser) {
            return next(new ErrorHandler_1.default("User not found", 400));
        }
        if (!(yield (0, adminstration_service_1.comparePassword)(password, checkUser.password))) {
            return next(new ErrorHandler_1.default("Invalid password", 400));
        }
        const findDevice = checkUser.Device
            ? yield (0, adminstration_service_1.findAdminDeviceService)({
                ip,
                browser: ua.browser || "",
                os: ua.os || "",
                device: ua.platform || "",
                administrationId: checkUser.id,
            })
            : null;
        if (checkUser.twoFactorSecret) {
            if (!twoFactorSecret) {
                return next(new ErrorHandler_1.default("Two factor secret is required", 400));
            }
            if (!(yield (0, bcryptjs_1.compare)(twoFactorSecret, checkUser.twoFactorSecret))) {
                return next(new ErrorHandler_1.default("Invalid two factor secret", 400));
            }
        }
        if (!findDevice) {
            yield db_1.default.device.create({
                data: {
                    ip: ip || "",
                    browser: ua.browser || "",
                    os: ua.os || "",
                    device: ua.platform || "",
                    administrationId: checkUser.id,
                },
            });
        }
        (0, createToken_1.sendTokenAdmin)(checkUser, 200, res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.adminstratorAddAndUpdateInfo = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    try {
        const { company_name, first_name, middle_name, sur_name, address, tel, inn, oked, x_r, bank, mfo, } = req.body;
        const findAdmin = yield (0, adminstration_service_1.administrationFind)((_a = req.adminstrator) === null || _a === void 0 ? void 0 : _a.id);
        if (!findAdmin || findAdmin.role !== "ADMIN") {
            return next(new ErrorHandler_1.default("Admin not found", 400));
        }
        const adminInfoData = {
            company_name: company_name || ((_b = findAdmin.AdminInfo) === null || _b === void 0 ? void 0 : _b.company_name),
            first_name: first_name || ((_c = findAdmin.AdminInfo) === null || _c === void 0 ? void 0 : _c.first_name),
            middle_name: middle_name || ((_d = findAdmin.AdminInfo) === null || _d === void 0 ? void 0 : _d.middle_name),
            sur_name: sur_name || ((_e = findAdmin.AdminInfo) === null || _e === void 0 ? void 0 : _e.sur_name),
            address: address || ((_f = findAdmin.AdminInfo) === null || _f === void 0 ? void 0 : _f.address),
            tel: tel || ((_g = findAdmin.AdminInfo) === null || _g === void 0 ? void 0 : _g.tel),
            inn: inn || ((_h = findAdmin.AdminInfo) === null || _h === void 0 ? void 0 : _h.inn),
            oked: oked || ((_j = findAdmin.AdminInfo) === null || _j === void 0 ? void 0 : _j.oked),
            x_r: x_r || ((_k = findAdmin.AdminInfo) === null || _k === void 0 ? void 0 : _k.x_r),
            bank: bank || ((_l = findAdmin.AdminInfo) === null || _l === void 0 ? void 0 : _l.bank),
            mfo: mfo || ((_m = findAdmin.AdminInfo) === null || _m === void 0 ? void 0 : _m.mfo),
            organizationLeader: `${first_name.charAt(0).toUpperCase()}.${middle_name
                .charAt(0)
                .toUpperCase()}.${sur_name.charAt(0).toUpperCase() + sur_name.slice(1)}` || ((_o = findAdmin.AdminInfo) === null || _o === void 0 ? void 0 : _o.organizationLeader),
            administrationId: (_p = req.adminstrator) === null || _p === void 0 ? void 0 : _p.id,
        };
        if (findAdmin.AdminInfo) {
            yield (0, adminstration_service_1.adminstratorUpdateInfoService)(adminInfoData);
        }
        else {
            yield (0, adminstration_service_1.adminstratorAddInfoService)(adminInfoData);
        }
        res.status(200).json({
            success: true,
            message: "Admin info added or updated successfully",
        });
    }
    catch (error) {
        console.log("Error updating admin info", error);
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.adminstratorTwoFactorAuthUpdateAndCreate = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { secret, oldSecret = "" } = req.body;
        const findAdmin = yield (0, adminstration_service_1.administrationFind)((_a = req.adminstrator) === null || _a === void 0 ? void 0 : _a.id);
        if (!findAdmin || findAdmin.role !== "ADMIN") {
            return next(new ErrorHandler_1.default("Admin not found", 400));
        }
        const twoFactorSecretHash = yield (0, bcryptjs_1.hash)(secret, 10);
        if (findAdmin.twoFactorSecret) {
            if (!oldSecret) {
                return next(new ErrorHandler_1.default("Old secret is required", 400));
            }
            if (!(yield (0, bcryptjs_1.compare)(oldSecret, findAdmin.twoFactorSecret))) {
                return next(new ErrorHandler_1.default("Invalid old secret", 400));
            }
        }
        yield db_1.default.administration.update({
            where: { id: (_b = req.adminstrator) === null || _b === void 0 ? void 0 : _b.id },
            data: {
                twoFactorSecret: twoFactorSecretHash,
                isTwoFactorAuth: true,
            },
        });
        res.status(200).json({
            success: true,
            message: "Two factor authentication enabled",
        });
    }
    catch (error) {
        console.log("Error updating two factor authentication", error);
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.getAdminstratorInfo = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!req.adminstrator) {
            return next(new ErrorHandler_1.default("Please login to get admin info", 400));
        }
        const findAdmin = yield (0, adminstration_service_1.administrationFind)((_a = req.adminstrator) === null || _a === void 0 ? void 0 : _a.id);
        if (!findAdmin) {
            return next(new ErrorHandler_1.default("Administrator not found", 400));
        }
        const { password, twoFactorSecret } = findAdmin, rest = __rest(findAdmin, ["password", "twoFactorSecret"]);
        res.status(200).json({
            success: true,
            message: "Admin info",
            data: rest,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.deleteAdminDevice = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const device_id = req.params.device_id;
        const findDevice = yield (0, adminstration_service_1.findAdminDeviceService)({
            administrationId: (_a = req.adminstrator) === null || _a === void 0 ? void 0 : _a.id,
            device_id,
        });
        if (!findDevice) {
            return next(new ErrorHandler_1.default("Device not found", 400));
        }
        yield (0, adminstration_service_1.deleteAdminDeviceService)(device_id);
        res.status(200).json({
            success: true,
            message: "Device deleted successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.deleteAdminProfile = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.adminstrator;
        const findAdmin = yield (0, adminstration_service_1.administrationFind)(id);
        if (!findAdmin) {
            return next(new ErrorHandler_1.default("Admin not found", 400));
        }
        yield db_1.default.administration.delete({ where: { id } });
        res.status(200).json({
            success: true,
            message: "Admin deleted successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default("Please login to delete profile", 500));
    }
}));
