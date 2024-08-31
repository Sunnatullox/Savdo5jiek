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
const axios_1 = __importDefault(require("axios"));
const db_1 = __importDefault(require("../config/db"));
const createToken_1 = require("../utils/createToken");
const request_ip_1 = __importDefault(require("request-ip"));
const express_useragent_1 = __importDefault(require("express-useragent"));
const user_service_1 = require("../services/user.service");
exports.login = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.headers["x_code"];
    const redirect_uri = req.headers["x_redirect_uri"];
    const clientId = process.env.ONE_ID_CLIENT_ID;
    const clientSecret = process.env.ONE_ID_CLIENT_SECRET;
    const scope = process.env.ONE_ID_SCOPE;
    const ip = request_ip_1.default.getClientIp(req); // Foydalanuvchining IP manzilini olish
    const ua = express_useragent_1.default.parse(req.headers["user-agent"]); // Foydalanuvchining qurilma ma'lumotlarini olish
    try {
        const getAccessToken = yield axios_1.default.post("https://sso.egov.uz/sso/oauth/Authorization.do", null, {
            params: {
                grant_type: "one_authorization_code",
                client_id: clientId,
                client_secret: clientSecret,
                code: code,
                redirect_uri: redirect_uri,
            },
        });
        if (getAccessToken.data.error) {
            return next(new ErrorHandler_1.default(getAccessToken.data.message, 400));
        }
        const { data } = yield axios_1.default.post("https://sso.egov.uz/sso/oauth/Authorization.do", null, {
            params: {
                grant_type: "one_access_token_identify",
                client_id: clientId,
                client_secret: clientSecret,
                access_token: getAccessToken.data.access_token,
                scope: scope,
            },
        });
        if (data.error) {
            return next(new ErrorHandler_1.default(data.error.message, 400));
        }
        console.log(data);
        const findUser = yield db_1.default.user.findUnique({
            where: {
                pin_jshshir: data.pin,
            },
            include: {
                legal_info: true,
                Contract: true,
            },
        });
        const { legal_info } = data;
        let legalDataToCreate = {};
        const basicLegalInfo = legal_info.find((info) => info.is_basic === true);
        if (basicLegalInfo) {
            legalDataToCreate = {
                create: {
                    name: basicLegalInfo.acron_UZ,
                    le_name: basicLegalInfo.le_name,
                    inn: basicLegalInfo.le_tin,
                    tin: basicLegalInfo.tin,
                },
            };
        }
        const findDevice = yield db_1.default.device.findFirst({
            where: {
                ip: ip || "",
                browser: ua.browser || "",
                os: ua.os || "",
                device: ua.platform || "",
                userId: findUser === null || findUser === void 0 ? void 0 : findUser.id,
            },
        });
        let user;
        if (!findUser) {
            user = yield db_1.default.user.create({
                data: {
                    pin_jshshir: data.pin,
                    user_id: data.user_id,
                    user_type: data.user_type,
                    valid: Boolean(data.valid),
                    passport_no: data.pport_no,
                    birth_date: data.birth_date,
                    birth_place: data.birth_place,
                    first_name: data.first_name,
                    full_name: data.full_name,
                    legal_info: basicLegalInfo ? legalDataToCreate : undefined,
                    is_LLC: basicLegalInfo ? true : false,
                    sur_name: data.sur_name,
                    middle_name: data.mid_name,
                },
                include: {
                    legal_info: true,
                    Device: true,
                },
            });
        }
        else if (findUser) {
            if (findUser.legal_info && basicLegalInfo) {
                yield db_1.default.legalInfo.update({
                    where: {
                        id: findUser.legal_info.id,
                    },
                    data: basicLegalInfo
                        ? {
                            name: basicLegalInfo.acron_UZ,
                            le_name: basicLegalInfo.le_name,
                            inn: basicLegalInfo.le_tin,
                            tin: basicLegalInfo.tin,
                        }
                        : findUser.legal_info,
                });
                user = yield db_1.default.user.findUnique({
                    where: {
                        id: findUser.id,
                    },
                    include: {
                        legal_info: true,
                        Device: true,
                    },
                });
            }
            else if (findUser.legal_info && !basicLegalInfo) {
                user = yield db_1.default.user.update({
                    where: {
                        pin_jshshir: data.pin,
                    },
                    include: {
                        legal_info: true,
                        Device: true,
                    },
                    data: {
                        is_LLC: false,
                    },
                });
            }
        }
        if (user) {
            if (!findDevice) {
                yield db_1.default.device.create({
                    data: {
                        ip: ip || "",
                        browser: ua.browser || "",
                        os: ua.os || "",
                        device: ua.platform || "",
                        userId: user === null || user === void 0 ? void 0 : user.id,
                    },
                });
            }
            yield (0, createToken_1.sendToken)(user, 200, res);
        }
        else {
            next(new ErrorHandler_1.default("User not found after update", 404));
        }
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
        if (req.user) {
            const user = yield db_1.default.user.findUnique({
                where: {
                    id: req.user.id,
                },
                include: {
                    legal_info: true,
                    Device: true,
                },
            });
            if (!user) {
                next(new ErrorHandler_1.default("User not found", 404));
            }
            res.status(200).json({
                message: "User fetched successfully",
                data: user,
            });
        }
        else {
            next(new ErrorHandler_1.default("Please login to access this route", 401));
        }
    }
    catch (error) {
        next(new ErrorHandler_1.default(error.message, 500));
    }
}));
exports.updateUserData = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { address = "", phone_number = "", oked = "", x_r = "", bank = "", mfo = "", } = req.body;
        if (req.user) {
            const userWithLegal = req.user;
            if (userWithLegal.legal_info) {
                if (address === "" ||
                    phone_number === "" ||
                    oked === "" ||
                    x_r === "" ||
                    bank === "" ||
                    mfo === "") {
                    next(new ErrorHandler_1.default("Please fill all the fields", 400));
                }
                yield db_1.default.legalInfo.update({
                    where: {
                        userId: userWithLegal.id,
                    },
                    data: {
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
                    },
                });
                const updateUser = yield db_1.default.user.update({
                    where: {
                        id: userWithLegal.id,
                    },
                    include: {
                        legal_info: true,
                    },
                    data: {
                        is_LLC: true,
                    },
                });
                res.status(200).json({
                    message: "User updated successfully",
                    data: {
                        user: updateUser,
                    },
                });
            }
            else {
                if (address === "" || phone_number === "") {
                    next(new ErrorHandler_1.default("Please fill all the fields", 400));
                }
                const updateUser = yield db_1.default.user.update({
                    where: {
                        id: req.user.id,
                    },
                    include: {
                        legal_info: true,
                    },
                    data: {
                        address,
                        phone_number,
                        is_LLC: false,
                    },
                });
                res.status(200).json({
                    message: "User updated successfully",
                    data: updateUser,
                });
            }
        }
        else {
            next(new ErrorHandler_1.default("Please login to access this route", 401));
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
