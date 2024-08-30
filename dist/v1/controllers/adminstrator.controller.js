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
exports.deleteAdminDevice = exports.getAdminstratorInfo = exports.adminstratorTwoFactorAuthUpdate = exports.adminstratorAddAndUpdateInfo = exports.adminstratorLogin = exports.adminstratorOTPVerify = exports.adminstratorOTP = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ErrorHandler_1 = __importDefault(require("../middleware/ErrorHandler"));
const db_1 = __importDefault(require("../config/db"));
const otp_generator_1 = __importDefault(require("otp-generator"));
const emailSender_1 = require("../utils/emailSender");
const emailAdminstratorTemp_1 = __importDefault(require("../gmail/emailAdminstratorTemp"));
const administration_service_1 = require("../services/administration.service");
const createToken_1 = require("../utils/createToken");
const bcryptjs_1 = require("bcryptjs");
const request_ip_1 = __importDefault(require("request-ip"));
const express_useragent_1 = __importDefault(require("express-useragent"));
exports.adminstratorOTP = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        // Eski va tasdiqlanmagan OTP yozuvlarini o'chirish
        yield db_1.default.oTP.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
                verified: false,
            },
        });
        const checkUser = yield db_1.default.administration.findUnique({
            where: {
                email,
                role: req.query.type === "admin" ? "ADMIN" : "TAX_AGENT",
            },
        });
        if (req.query.type === "admin") {
            const checkAdmin = yield db_1.default.administration.findMany({
                where: {
                    role: "ADMIN",
                },
            });
            if (checkAdmin.length > 0) {
                return next(new ErrorHandler_1.default("Admin already exists", 400));
            }
        }
        if (req.query.type !== "admin" && req.query.type !== "tax_agent") {
            return next(new ErrorHandler_1.default("Invalid type", 400));
        }
        if (checkUser) {
            return next(new ErrorHandler_1.default("User already exists", 400));
        }
        const otp = otp_generator_1.default.generate(5, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        yield (0, emailSender_1.mailSender)(process.env.SENDER_EMAIL, "OTP Email Verificatsiya Tekshiruvi", (0, emailAdminstratorTemp_1.default)(otp, name));
        yield db_1.default.oTP.create({
            data: {
                email,
                user: {
                    name,
                    email,
                    password,
                    role: req.query.type === "admin" ? "ADMIN" : "TAX_AGENT",
                },
                code: otp,
                type: req.query.type === "admin" ? "ADMIN" : "TAX_AGENT",
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
        const checkOTP = yield db_1.default.oTP.findFirst({
            where: {
                email,
                expiresAt: {
                    gt: new Date(),
                },
                verified: false,
                type: req.query.type === "admin" ? "ADMIN" : "TAX_AGENT",
            },
        });
        if (!checkOTP) {
            return next(new ErrorHandler_1.default("OTP not found", 400));
        }
        if (checkOTP.code !== otp) {
            return next(new ErrorHandler_1.default("Invalid OTP", 400));
        }
        if (checkOTP.expiresAt < new Date()) {
            yield db_1.default.oTP.delete({
                where: {
                    id: checkOTP.id,
                },
            });
            return next(new ErrorHandler_1.default("OTP expired", 400));
        }
        yield db_1.default.oTP.update({
            where: {
                id: checkOTP.id,
            },
            data: {
                verified: true,
            },
        });
        yield (0, administration_service_1.createAdministration)(checkOTP.user);
        yield db_1.default.oTP.delete({
            where: {
                id: checkOTP.id,
            },
        });
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
        const ip = request_ip_1.default.getClientIp(req); // Foydalanuvchining IP manzilini olish
        const ua = express_useragent_1.default.parse(req.headers["user-agent"]); // Foydalanuvchining qurilma ma'lumotlarini olish
        const checkUser = (yield db_1.default.administration.findUnique({
            where: {
                email,
            },
            include: {
                Device: true,
            },
        }));
        if (!checkUser) {
            return next(new ErrorHandler_1.default("User not found", 400));
        }
        if (!(0, administration_service_1.comparePassword)(password, checkUser.password)) {
            return next(new ErrorHandler_1.default("Invalid password", 400));
        }
        const findDevice = yield (0, administration_service_1.findAdminDeviceService)(checkUser.id);
        if (!findDevice) {
            yield db_1.default.device.create({
                data: {
                    ip: ip,
                    browser: ua.browser,
                    os: ua.os,
                    device: ua.device,
                    administrationId: checkUser.id,
                },
            });
        }
        if (checkUser.twoFactorSecret) {
            if (!twoFactorSecret) {
                return next(new ErrorHandler_1.default("Two factor secret is required", 400));
            }
            const checkTwoFactorSecret = yield (0, bcryptjs_1.compare)(twoFactorSecret, checkUser.twoFactorSecret);
            if (!checkTwoFactorSecret) {
                return next(new ErrorHandler_1.default("Invalid two factor secret", 400));
            }
        }
        (0, createToken_1.sendTokenAdmin)(checkUser, 200, res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.adminstratorAddAndUpdateInfo = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { company_name, first_name, middle_name, sur_name, address, tel, inn, oked, x_r, bank, mfo, } = req.body;
        const findAdmin = yield (0, administration_service_1.administrationFind)((_a = req.adminstrator) === null || _a === void 0 ? void 0 : _a.id);
        if (!findAdmin || findAdmin.role !== "ADMIN") {
            return next(new ErrorHandler_1.default("Admin not found", 400));
        }
        if (findAdmin.AdminInfo) {
            yield (0, administration_service_1.adminstratorUpdateInfoService)({
                company_name: company_name || findAdmin.AdminInfo.company_name,
                first_name: first_name || findAdmin.AdminInfo.first_name,
                middle_name: middle_name || findAdmin.AdminInfo.middle_name,
                sur_name: sur_name || findAdmin.AdminInfo.sur_name,
                address: address || findAdmin.AdminInfo.address,
                tel: tel || findAdmin.AdminInfo.tel,
                inn: inn || findAdmin.AdminInfo.inn,
                oked: oked || findAdmin.AdminInfo.oked,
                x_r: x_r || findAdmin.AdminInfo.x_r,
                bank: bank || findAdmin.AdminInfo.bank,
                mfo: mfo || findAdmin.AdminInfo.mfo,
                organizationLeader: `${first_name.charAt(0).toUpperCase()}.${middle_name
                    .charAt(0)
                    .toUpperCase()}.${sur_name.charAt(0).toUpperCase() + sur_name.slice(1)}` || findAdmin.AdminInfo.organizationLeader,
                administrationId: (_b = req.adminstrator) === null || _b === void 0 ? void 0 : _b.id,
            });
        }
        else {
            yield (0, administration_service_1.adminstratorAddInfoService)({
                company_name,
                first_name,
                middle_name,
                sur_name,
                address,
                tel,
                inn,
                oked,
                x_r,
                bank,
                mfo,
                organizationLeader: `${first_name
                    .charAt(0)
                    .toUpperCase()}.${middle_name.charAt(0).toUpperCase()}.${sur_name.charAt(0).toUpperCase() + sur_name.slice(1)}`,
                administrationId: (_c = req.adminstrator) === null || _c === void 0 ? void 0 : _c.id,
            });
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
exports.adminstratorTwoFactorAuthUpdate = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { secret, oldSecret = "" } = req.body;
        const findAdmin = yield (0, administration_service_1.administrationFind)((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        if (!findAdmin || findAdmin.role !== "ADMIN") {
            return next(new ErrorHandler_1.default("Admin not found", 400));
        }
        const twoFactorSecretHash = yield (0, bcryptjs_1.hash)(secret, 10);
        if (findAdmin.twoFactorSecret) {
            if (!oldSecret) {
                return next(new ErrorHandler_1.default("Old secret is required", 400));
            }
            const checkOldSecret = yield (0, bcryptjs_1.compare)(oldSecret, findAdmin.twoFactorSecret);
            if (!checkOldSecret) {
                return next(new ErrorHandler_1.default("Invalid old secret", 400));
            }
            yield db_1.default.administration.update({
                where: {
                    id: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id,
                },
                data: {
                    twoFactorSecret: twoFactorSecretHash,
                    isTwoFactorAuth: true,
                },
            });
        }
        else {
            yield db_1.default.administration.update({
                where: {
                    id: (_c = req.user) === null || _c === void 0 ? void 0 : _c.id,
                },
                data: {
                    twoFactorSecret: twoFactorSecretHash,
                },
            });
        }
        res.status(200).json({
            success: true,
            message: "Two factor authentication enabled",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.getAdminstratorInfo = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!req.adminstrator) {
            return next(new ErrorHandler_1.default("Pliese login to get admin info", 400));
        }
        const findAdmin = yield (0, administration_service_1.administrationFind)((_a = req.adminstrator) === null || _a === void 0 ? void 0 : _a.id);
        if (!findAdmin) {
            return next(new ErrorHandler_1.default("AdminStra not found", 400));
        }
        res.status(200).json({
            success: true,
            message: "Admin info",
            data: findAdmin,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.deleteAdminDevice = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const device_id = req.params.device_id;
        const findDevice = yield (0, administration_service_1.findAdminDeviceService)(device_id);
        if (!findDevice) {
            return next(new ErrorHandler_1.default("Device not found", 400));
        }
        yield (0, administration_service_1.deleteAdminDeviceService)(device_id);
        res.status(200).json({
            success: true,
            message: "Device deleted successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
