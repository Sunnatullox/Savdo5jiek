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
exports.mailSender = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const mailSender = (email, title, body) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("mailSender",email,title,body)
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: process.env.MAIL_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });
        const info = yield transporter.sendMail({
            from: process.env.SENDER_NAME,
            to: email,
            subject: title,
            html: body
        });
        return info;
    }
    catch (error) {
        console.log("mailSender error", error);
        return error;
    }
});
exports.mailSender = mailSender;
