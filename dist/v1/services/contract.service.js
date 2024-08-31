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
exports.createContractService = createContractService;
exports.getContractsByAdminService = getContractsByAdminService;
exports.getContractsByIdService = getContractsByIdService;
exports.getContractByIdService = getContractByIdService;
exports.updateContractService = updateContractService;
exports.deleteContractService = deleteContractService;
exports.newNotifsContractisAdmin = newNotifsContractisAdmin;
exports.addBusinessDays = addBusinessDays;
exports.getContractByTaxAgentService = getContractByTaxAgentService;
const db_1 = __importDefault(require("../config/db"));
function createContractService(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.contract.create({
            data,
        });
    });
}
function getContractsByAdminService() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.contract.findMany({
            include: {
                User: {
                    include: {
                        legal_info: true,
                    },
                },
                Payment: true,
            },
        });
    });
}
function getContractsByIdService(id, is_LLC) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.contract.findMany({
            where: { userId: id, is_LLC: is_LLC },
            include: {
                User: {
                    include: {
                        legal_info: true,
                    },
                },
                Payment: true,
            },
        });
    });
}
function getContractByIdService(id, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const contract = yield db_1.default.contract.findUnique({
            where: userId ? { id, userId } : { id },
            include: {
                User: {
                    include: {
                        legal_info: true,
                    },
                },
                Payment: true,
            },
        });
        if (!userId) {
            yield db_1.default.contract.update({
                where: { id },
                data: { isRead: true }
            });
        }
        return contract;
    });
}
function updateContractService(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.contract.update({
            where: { id },
            data: Object.assign(Object.assign({}, data), { Payment: {
                    updateMany: {
                        where: { contractId: id },
                        data: { isRead: true }
                    }
                } }),
        });
    });
}
function deleteContractService(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.contract.delete({
            where: { id },
        });
    });
}
function newNotifsContractisAdmin() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.contract.findMany({
            where: {
                isRead: false
            },
            include: {
                User: true
            }
        });
    });
}
function addBusinessDays(date, days) {
    return __awaiter(this, void 0, void 0, function* () {
        let count = 0;
        while (count < days) {
            date.setDate(date.getDate() + 1);
            // Check if it's a weekday (Monday to Friday)
            if (date.getDay() !== 0 && date.getDay() !== 6) {
                count++;
            }
        }
        return date;
    });
}
function getContractByTaxAgentService(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.contract.findMany(query);
    });
}
