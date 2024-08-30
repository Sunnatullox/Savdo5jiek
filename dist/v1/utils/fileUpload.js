"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentImgUpload = exports.docUpload = exports.imgUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
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
        cb(null, 'public/contracts');
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
