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
        return db_1.default.administration.create({
            data: Object.assign(Object.assign({}, data), { password: hashedPassword, AdminInfo: data.AdminInfo ? { create: data.AdminInfo } : undefined, Device: data.Device ? { create: data.Device } : undefined }),
        });
    });
}
function signAccessToken(adminId) {
    return __awaiter(this, void 0, void 0, function* () {
        return jsonwebtoken_1.default.sign({ id: adminId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });
    });
}
function signRefreshToken(adminId) {
    return __awaiter(this, void 0, void 0, function* () {
        return jsonwebtoken_1.default.sign({ id: adminId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '3d' });
    });
}
function comparePassword(plainPassword, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcryptjs_1.default.compare(plainPassword, hashedPassword);
    });
}
function administrationFind(adminId) {
    return __awaiter(this, void 0, void 0, function* () {
        return db_1.default.administration.findUnique({
            where: { id: adminId },
            include: { AdminInfo: true, Device: true },
        });
    });
}
function adminstratorInfo(adminId) {
    return __awaiter(this, void 0, void 0, function* () {
        return db_1.default.adminInfo.findUnique({
            where: { administrationId: adminId },
            include: { Administration: true },
        });
    });
}
function adminstratorAddInfoService(data) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!data.administrationId)
            throw new Error("administrationId is required");
        const { Administration } = data, restData = __rest(data, ["Administration"]);
        return db_1.default.adminInfo.create({
            data: Object.assign(Object.assign({}, restData), { administrationId: data.administrationId }),
        });
    });
}
function adminstratorUpdateInfoService(data) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!data.administrationId)
            throw new Error("administrationId is required");
        const { Administration } = data, restData = __rest(data, ["Administration"]);
        return db_1.default.adminInfo.update({
            where: { administrationId: data.administrationId },
            data: Object.assign(Object.assign({}, restData), { administrationId: data.administrationId }),
        });
    });
}
function findAdminDeviceService(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return db_1.default.device.findFirst({ where: Object.assign({}, data) });
    });
}
function deleteAdminDeviceService(device_id) {
    return __awaiter(this, void 0, void 0, function* () {
        return db_1.default.device.delete({ where: { id: device_id } });
    });
}
