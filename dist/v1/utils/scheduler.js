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
const node_schedule_1 = __importDefault(require("node-schedule"));
const db_1 = __importDefault(require("../config/db"));
const fs_1 = __importDefault(require("fs"));
const payment_service_1 = require("../services/payment.service");
const messages_service_1 = require("../services/messages.service");
const deleteExpiredContracts = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const formattedYesterday = yesterday.toISOString().slice(0, 10);
        const contracts = yield db_1.default.contract.findMany({
            where: {
                contractEndDate: {
                    lte: formattedYesterday,
                },
                Payment: {
                    some: {
                        status: {
                            not: "approved",
                        },
                    },
                },
                status: {
                    not: "approved",
                },
            },
            include: {
                Payment: true,
                Message: true,
            },
        });
        // Delete payments and messages in parallel
        yield Promise.all(contracts.map((contract) => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.all(contract.Payment.map((payment) => __awaiter(void 0, void 0, void 0, function* () {
                yield deleteFile(payment.receiptImage);
                yield (0, payment_service_1.deletePayment)(payment.id);
            })));
            yield Promise.all(contract.Message.map((message) => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, messages_service_1.deleteMessageAdminService)(message.id);
            })));
            const contractFile = contract.contractFile;
            if (contractFile) {
                if (contractFile.contractFileUz) {
                    yield deleteFile(contractFile.contractFileUz);
                }
                if (contractFile.contractFileRu) {
                    yield deleteFile(contractFile.contractFileRu);
                }
            }
            yield db_1.default.contract.delete({
                where: { id: contract.id },
            });
            console.log(`Contract with ID ${contract.id} has been deleted.`);
        })));
    }
    catch (error) {
        console.log(error.message);
    }
});
// Delete contract files
function deleteFile(fileUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = new URL(fileUrl);
        const filePath = `.${url.pathname}`;
        if (fs_1.default.existsSync(filePath)) {
            yield fs_1.default.promises.unlink(filePath).catch((err) => {
                throw err;
            });
        }
    });
}
// Har kuni soat 00:00 da ushbu funksiyani ishga tushirish
node_schedule_1.default.scheduleJob("0 0 * * *", deleteExpiredContracts);
