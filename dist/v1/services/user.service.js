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
exports.deleteUserService = exports.getAllUsersByAdminService = exports.updateUser = exports.updateUserLegalInfo = exports.getUserById = exports.findOrCreateDevice = exports.findOrCreateUser = exports.getUserData = exports.getAccessToken = void 0;
exports.findUserDeviceService = findUserDeviceService;
exports.deleteUserDeviceService = deleteUserDeviceService;
const fs_1 = __importDefault(require("fs"));
const db_1 = __importDefault(require("../config/db"));
const ErrorHandler_1 = __importDefault(require("../middleware/ErrorHandler"));
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
    console.log("code service", code);
    const clientId = process.env.ONE_ID_CLIENT_ID;
    const clientSecret = process.env.ONE_ID_CLIENT_SECRET;
    const response = yield fetch("https://sso.egov.uz/sso/oauth/Authorization.do", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            grant_type: "one_authorization_code",
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            redirect_uri: redirect_uri,
        }),
    });
    const data = yield response.json();
    if (data.error) {
        throw new ErrorHandler_1.default(data.message, 400);
    }
    return data;
});
exports.getAccessToken = getAccessToken;
const getUserData = (accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    const clientId = process.env.ONE_ID_CLIENT_ID;
    const clientSecret = process.env.ONE_ID_CLIENT_SECRET;
    const scope = process.env.ONE_ID_SCOPE;
    const response = yield fetch("https://sso.egov.uz/sso/oauth/Authorization.do", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            grant_type: "one_access_token_identify",
            client_id: clientId,
            client_secret: clientSecret,
            access_token: accessToken,
            scope: scope,
        }),
    });
    const data = yield response.json();
    if (data.error) {
        throw new ErrorHandler_1.default(data.error.message, 400);
    }
    return data;
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
            os: ua.os || "",
            device: ua.platform || "",
            userId: user.id,
        },
    });
    if (!findDevice && ip !== "::1") {
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
const getAllUsersByAdminService = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.user.findMany({
        include: {
            legal_info: true,
        },
        orderBy: {
            createdAt: "asc",
        },
    });
});
exports.getAllUsersByAdminService = getAllUsersByAdminService;
const deleteUserService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield db_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const findUser = yield (0, exports.getUserById)(userId);
        if (!findUser) {
            throw new ErrorHandler_1.default("User not found", 404);
        }
        const userContract = yield tx.contract.findMany({
            where: {
                userId: userId,
                status: "approved",
            },
        });
        if (userContract.length > 0) {
            throw new ErrorHandler_1.default("User has an active contract", 400);
        }
        const userPayment = yield tx.payment.findMany({
            where: {
                userId: userId,
                status: "approved",
            },
        });
        if (userPayment.length > 0) {
            throw new ErrorHandler_1.default("User has an active payment", 400);
        }
        const userContracts = yield tx.contract.findMany({
            where: {
                userId: userId,
            },
        });
        for (const contract of userContracts) {
            const contractFile = contract === null || contract === void 0 ? void 0 : contract.contractFile;
            if (contractFile) {
                if (contractFile.contractFileUz) {
                    yield deleteFile(contractFile.contractFileUz);
                }
                if (contractFile.contractFileRu) {
                    yield deleteFile(contractFile.contractFileRu);
                }
            }
        }
        const userPayments = yield tx.payment.findMany({
            where: {
                userId,
            },
        });
        for (const payment of userPayments) {
            const paymentFile = payment === null || payment === void 0 ? void 0 : payment.receiptImage;
            if (paymentFile) {
                yield deleteFile(paymentFile);
            }
        }
        yield tx.contract.deleteMany({
            where: {
                userId: userId,
            },
        });
        yield tx.payment.deleteMany({
            where: {
                userId,
            },
        });
        yield tx.message.deleteMany({
            where: {
                userId,
            },
        });
        yield tx.device.deleteMany({
            where: {
                userId,
            },
        });
        yield tx.legalInfo.delete({
            where: {
                userId,
            },
        });
        yield tx.user.delete({
            where: {
                id: userId,
            },
        });
    }));
    return transaction;
});
exports.deleteUserService = deleteUserService;
function deleteFile(fileUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = new URL(fileUrl);
        const filePath = `.${url.pathname}`;
        if (fs_1.default.existsSync(filePath)) {
            yield fs_1.default.promises.unlink(filePath).catch((err) => {
                if (err === "ENOENT") {
                    return;
                }
                throw err;
            });
        }
    });
}
