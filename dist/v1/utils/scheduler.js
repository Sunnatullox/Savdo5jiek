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
const deleteExpiredContracts = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const now = new Date();
        const contracts = yield db_1.default.contract.findMany({
            where: {
                contractEndDate: {
                    lte: now.toISOString().slice(0, 10) // ISO formatdagi sanani olish
                }
            }
        });
        for (const contract of contracts) {
            yield db_1.default.contract.delete({
                where: { id: contract.id }
            });
            console.log(`Contract with ID ${contract.id} has been deleted.`);
        }
    }
    catch (error) {
        console.log(error.message);
    }
});
// Har kuni soat 00:00 da ushbu funksiyani ishga tushirish
node_schedule_1.default.scheduleJob('0 0 * * *', deleteExpiredContracts);
