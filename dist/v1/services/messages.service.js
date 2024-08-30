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
exports.getNotficationAdminService = exports.getNotficationUserService = exports.getMessagesUserByContractIdService = exports.getMessagesAdminByContractIdService = exports.sendMessageAdminService = exports.sendMessageUserService = void 0;
const db_1 = __importDefault(require("../config/db"));
const sendMessageUserService = (contractId, userId, message) => __awaiter(void 0, void 0, void 0, function* () {
    const messageData = yield db_1.default.message.create({
        data: {
            message,
            userId,
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
            contractId,
            userId: adminId,
        },
    });
    return messageData;
});
exports.sendMessageAdminService = sendMessageAdminService;
// export const getMessagesUser = async (userId: string): Promise<object[]> => {
//   const messages = await prisma.message.findMany({
//     where: {
//       userId,
//     },
//     include: {
//       contract: true,
//     },
//   });
//   return messages;
// };
// export const getMessagesAdmin = async (): Promise<object[]> => {
//   const messages = await prisma.message.findMany({
//     where: {
//       isAdmin: true,
//     },
//     include: {
//       contract: true,
//     },
//   });
//   return messages;
// };
const getMessagesAdminByContractIdService = (contractId) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield db_1.default.message.findMany({
        where: {
            contractId,
            isAdmin: true,
        },
        include: {
            user: true,
            contract: true,
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
            contractId,
            userId,
        },
        include: {
            user: true,
            contract: true,
        },
    });
    yield db_1.default.message.updateMany({
        where: {
            contractId,
            userId,
        },
        data: {
            isReadUser: true,
        },
    });
    return messages;
});
exports.getMessagesUserByContractIdService = getMessagesUserByContractIdService;
const getNotficationUserService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield db_1.default.message.findMany({
        where: {
            userId,
            isReadUser: false,
        },
    });
    return messages;
});
exports.getNotficationUserService = getNotficationUserService;
const getNotficationAdminService = () => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield db_1.default.message.findMany({
        where: {
            isAdmin: true,
            isReadAdmin: false,
        },
    });
    return messages;
});
exports.getNotficationAdminService = getNotficationAdminService;
