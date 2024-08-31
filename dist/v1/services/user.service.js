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
exports.updateUser = exports.updateUserLegalInfo = exports.getUserById = exports.findOrCreateDevice = exports.findOrCreateUser = exports.getUserData = exports.getAccessToken = void 0;
exports.findUserDeviceService = findUserDeviceService;
exports.deleteUserDeviceService = deleteUserDeviceService;
const db_1 = __importDefault(require("../config/db"));
const axios_1 = __importDefault(require("axios"));
const ErrorHandler_1 = __importDefault(require("../middleware/ErrorHandler"));
// export async function signAccessToken(userId: string) {
//   return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET as string, {
//     expiresIn: "5m",
//   });
// }
// export async function signRefreshToken(userId: string) {
//   return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET as string, {
//     expiresIn: "3d",
//   });
// }
// export async function comparePassword(
//   plainPassword: string,
//   hashedPassword: string
// ): Promise<boolean> {
//   return bcrypt.compare(plainPassword, hashedPassword);
// }
function findUserDeviceService(device_id, user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.device.findFirst({
            where: {
                id: device_id,
                userId: user_id,
            },
        });
    });
}
function deleteUserDeviceService(device_id, user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.device.delete({
            where: {
                id: device_id,
                userId: user_id,
            },
        });
    });
}
const getAccessToken = (code, redirect_uri) => __awaiter(void 0, void 0, void 0, function* () {
    const clientId = process.env.ONE_ID_CLIENT_ID;
    const clientSecret = process.env.ONE_ID_CLIENT_SECRET;
    const response = yield axios_1.default.post("https://sso.egov.uz/sso/oauth/Authorization.do", null, {
        params: {
            grant_type: "one_authorization_code",
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            redirect_uri: redirect_uri,
        },
    });
    if (response.data.error) {
        throw new ErrorHandler_1.default(response.data.message, 400);
    }
    return response.data;
});
exports.getAccessToken = getAccessToken;
const getUserData = (accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    const clientId = process.env.ONE_ID_CLIENT_ID;
    const clientSecret = process.env.ONE_ID_CLIENT_SECRET;
    const scope = process.env.ONE_ID_SCOPE;
    const response = yield axios_1.default.post("https://sso.egov.uz/sso/oauth/Authorization.do", null, {
        params: {
            grant_type: "one_access_token_identify",
            client_id: clientId,
            client_secret: clientSecret,
            access_token: accessToken,
            scope: scope,
        },
    });
    if (response.data.error) {
        throw new ErrorHandler_1.default(response.data.error.message, 400);
    }
    return response.data;
});
exports.getUserData = getUserData;
const findOrCreateUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const findUser = yield db_1.default.user.findUnique({
        where: {
            pin_jshshir: data.pin,
        },
        include: {
            legal_info: true,
            Contract: true,
        },
    });
    if (!findUser) {
        const basicLegalInfo = data.legal_info.find((info) => info.is_basic === true);
        const legalDataToCreate = basicLegalInfo
            ? {
                create: {
                    name: basicLegalInfo.acron_UZ,
                    le_name: basicLegalInfo.le_name,
                    inn: basicLegalInfo.le_tin,
                    tin: basicLegalInfo.tin,
                },
            }
            : undefined;
        const user = yield db_1.default.user.create({
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
                legal_info: legalDataToCreate,
                is_LLC: Boolean(basicLegalInfo),
                sur_name: data.sur_name,
                middle_name: data.mid_name,
            },
            include: {
                legal_info: true,
                Device: true,
            },
        });
        return user;
    }
    else {
        const basicLegalInfo = data.legal_info.find((info) => info.is_basic === true);
        if (findUser.legal_info && basicLegalInfo) {
            yield db_1.default.legalInfo.update({
                where: {
                    id: findUser.legal_info.id,
                },
                data: {
                    name: basicLegalInfo.acron_UZ,
                    le_name: basicLegalInfo.le_name,
                    inn: basicLegalInfo.le_tin,
                    tin: basicLegalInfo.tin,
                },
            });
        }
        else if (findUser.legal_info && !basicLegalInfo) {
            yield db_1.default.user.update({
                where: {
                    pin_jshshir: data.pin,
                },
                data: {
                    is_LLC: false,
                },
            });
        }
        return yield db_1.default.user.findUnique({
            where: {
                id: findUser.id,
            },
            include: {
                legal_info: true,
                Device: true,
            },
        });
    }
});
exports.findOrCreateUser = findOrCreateUser;
const findOrCreateDevice = (user, ip, ua) => __awaiter(void 0, void 0, void 0, function* () {
    const findDevice = yield db_1.default.device.findFirst({
        where: {
            ip: ip || "",
            browser: ua.browser || "",
            os: ua.os || "",
            device: ua.platform || "",
            userId: user.id,
        },
    });
    if (!findDevice) {
        yield db_1.default.device.create({
            data: {
                ip: ip || "",
                browser: ua.browser || "",
                os: ua.os || "",
                device: ua.platform || "",
                userId: user.id,
            },
        });
    }
});
exports.findOrCreateDevice = findOrCreateDevice;
const getUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.default.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            legal_info: true,
            Device: true,
        },
    });
    if (!user) {
        throw new ErrorHandler_1.default("User not found", 404);
    }
    return user;
});
exports.getUserById = getUserById;
const updateUserLegalInfo = (userId, legalInfoData) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedLegalInfo = yield db_1.default.legalInfo.update({
        where: {
            userId: userId,
        },
        data: legalInfoData,
    });
    return updatedLegalInfo;
});
exports.updateUserLegalInfo = updateUserLegalInfo;
const updateUser = (userId, userData) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedUser = yield db_1.default.user.update({
        where: {
            id: userId,
        },
        data: userData,
        include: {
            legal_info: true,
        },
    });
    return updatedUser;
});
exports.updateUser = updateUser;
