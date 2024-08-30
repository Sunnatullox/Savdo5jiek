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
exports.createAdministration = createAdministration;
exports.signAccessToken = signAccessToken;
exports.signRefreshToken = signRefreshToken;
exports.comparePassword = comparePassword;
exports.administrationFind = administrationFind;
exports.adminstratorInfo = adminstratorInfo;
exports.adminstratorAddInfoService = adminstratorAddInfoService;
exports.adminstratorUpdateInfoService = adminstratorUpdateInfoService;
exports.findAdminDeviceService = findAdminDeviceService;
exports.deleteAdminDeviceService = deleteAdminDeviceService;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../config/db"));
function createAdministration(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedPassword = yield bcryptjs_1.default.hash(data.password, 10);
        return yield db_1.default.administration.create({
            data: Object.assign(Object.assign({}, data), { password: hashedPassword }),
        });
    });
}
function signAccessToken(adminId) {
    return __awaiter(this, void 0, void 0, function* () {
        return jsonwebtoken_1.default.sign({ id: adminId }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '5m',
        });
    });
}
function signRefreshToken(adminId) {
    return __awaiter(this, void 0, void 0, function* () {
        return jsonwebtoken_1.default.sign({ id: adminId }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d',
        });
    });
}
function comparePassword(plainPassword, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcryptjs_1.default.compare(plainPassword, hashedPassword);
    });
}
function administrationFind(adminId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.administration.findUnique({
            where: {
                id: adminId,
            },
            include: {
                AdminInfo: true,
                Device: true,
            },
        });
    });
}
function adminstratorInfo(adminId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.adminInfo.findUnique({
            where: {
                administrationId: adminId,
            },
            include: {
                Administration: true,
            },
        });
    });
}
function adminstratorAddInfoService(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.adminInfo.create({
            data,
        });
    });
}
function adminstratorUpdateInfoService(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.adminInfo.update({
            where: {
                administrationId: data.administrationId,
            },
            data,
        });
    });
}
function findAdminDeviceService(device_id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.device.findFirst({
            where: {
                id: device_id
            }
        });
    });
}
function deleteAdminDeviceService(device_id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.device.delete({
            where: {
                id: device_id
            }
        });
    });
}
