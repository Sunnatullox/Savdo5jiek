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
exports.paymentImgUpload = exports.docUpload = exports.imgUpload = void 0;
exports.qrCodeGenerator = qrCodeGenerator;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const qrcode_1 = __importDefault(require("qrcode"));
const imgStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/imgs');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const docStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/contracts/contract_delivery_doc');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const paymentImgStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/payments');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
// Multer upload instance
const imgUpload = (0, multer_1.default)({ storage: imgStorage });
exports.imgUpload = imgUpload;
const docUpload = (0, multer_1.default)({ storage: docStorage });
exports.docUpload = docUpload;
const paymentImgUpload = (0, multer_1.default)({ storage: paymentImgStorage });
exports.paymentImgUpload = paymentImgUpload;
function qrCodeGenerator(pathurl) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield qrcode_1.default.toDataURL(pathurl);
        }
        catch (error) {
            throw new Error();
        }
    });
}
