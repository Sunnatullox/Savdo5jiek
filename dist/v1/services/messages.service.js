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
exports.deleteMessageAdminService = exports.deleteMessageUserService = exports.getNotficationAdminService = exports.getNotficationUserService = exports.getMessagesUserByContractIdService = exports.getMessagesAdminByContractIdService = exports.getMessagesAdminService = exports.getMessagesUserService = exports.sendMessageAdminService = exports.sendMessageUserService = void 0;
const db_1 = __importDefault(require("../config/db"));
const contract_service_1 = require("./contract.service");
const sendMessageUserService = (contractId, userId, message) => __awaiter(void 0, void 0, void 0, function* () {
    const messageData = yield db_1.default.message.create({
        data: {
            message,
            userId,
            isReadUser: true,
            contractId,
        },
    });
    return messageData;
});
exports.sendMessageUserService = sendMessageUserService;
const sendMessageAdminService = (adminId, contractId, message) => __awaiter(void 0, void 0, void 0, function* () {
    const messageData = yield db_1.default.message.create({
        data: {
            message,
            isAdmin: true,
            isReadAdmin: true,
            contractId,
            adminId,
        },
    });
    return messageData;
});
exports.sendMessageAdminService = sendMessageAdminService;
const getMessagesUserService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userContracts = yield (0, contract_service_1.getContractsByIdService)(userId);
    const messages = yield db_1.default.message.findMany({
        where: {
            contractId: {
                in: userContracts.map((contract) => contract.id),
            },
            isAdmin: true,
        },
        include: {
            user: true,
            contract: {
                select: {
                    id: true,
                    contract_id: true,
                    paidAmount: true,
                    deliveryDate: true,
                    status: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return messages;
});
exports.getMessagesUserService = getMessagesUserService;
const getMessagesAdminService = (adminId) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield db_1.default.message.findMany({
        where: {
            isAdmin: false,
        },
        include: {
            user: true,
            contract: {
                select: {
                    id: true,
                    contract_id: true,
                    paidAmount: true,
                    deliveryDate: true,
                    status: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return messages;
});
exports.getMessagesAdminService = getMessagesAdminService;
const getMessagesAdminByContractIdService = (contractId) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield db_1.default.message.findMany({
        where: {
            contractId
        },
        include: {
            user: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    yield db_1.default.message.updateMany({
        where: {
            contractId,
        },
        data: {
            isReadAdmin: true,
        },
    });
    return messages;
});
exports.getMessagesAdminByContractIdService = getMessagesAdminByContractIdService;
const getMessagesUserByContractIdService = (contractId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield db_1.default.message.findMany({
        where: {
            contractId
        },
        include: {
            user: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    yield db_1.default.message.updateMany({
        where: {
            contractId
        },
        data: {
            isReadUser: true,
        },
    });
    return messages;
});
exports.getMessagesUserByContractIdService = getMessagesUserByContractIdService;
const getNotficationUserService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const findUserContract = yield (0, contract_service_1.getContractsByIdService)(userId);
    const messages = yield db_1.default.message.findMany({
        where: {
            contractId: {
                in: findUserContract.map((contract) => contract.id),
            },
            isReadUser: false,
            isAdmin: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return messages;
});
exports.getNotficationUserService = getNotficationUserService;
const getNotficationAdminService = () => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield db_1.default.message.findMany({
        where: {
            isAdmin: false,
            isReadAdmin: false,
        },
        include: {
            user: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return messages;
});
exports.getNotficationAdminService = getNotficationAdminService;
const deleteMessageUserService = (messageId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.message.delete({
        where: {
            id: messageId,
            userId: userId,
        },
    });
});
exports.deleteMessageUserService = deleteMessageUserService;
const deleteMessageAdminService = (messageId, adminId) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.message.delete({
        where: {
            id: messageId,
            adminId: adminId,
        },
    });
});
exports.deleteMessageAdminService = deleteMessageAdminService;
