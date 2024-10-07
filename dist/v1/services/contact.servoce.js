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
exports.createContactUs = createContactUs;
exports.getContactUs = getContactUs;
exports.getContactUsList = getContactUsList;
exports.updateContactUs = updateContactUs;
exports.deleteContactUs = deleteContactUs;
const db_1 = __importDefault(require("../config/db"));
function createContactUs(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.contactUs.create({
            data
        });
    });
}
function getContactUs(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.contactUs.findUnique({
            where: {
                id
            }
        });
    });
}
function getContactUsList(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.contactUs.findMany(query);
    });
}
function updateContactUs(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.contactUs.update({
            where: {
                id
            },
            data
        });
    });
}
function deleteContactUs(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.contactUs.delete({
            where: {
                id
            }
        });
    });
}
