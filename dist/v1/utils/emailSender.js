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
const mailSender = (emails, title, body) => __awaiter(void 0, void 0, void 0, function* () {
    const emailItems = emails === null || emails === void 0 ? void 0 : emails.split(",");
    try {
        if (emailItems.length > 1) {
            for (let index = 0; index < emailItems.length; index++) {
                const email = emailItems[index];
                const transporter = nodemailer_1.default.createTransport({
                    host: process.env.MAIL_HOST,
                    port: 465,
                    secure: true,
                    auth: {
                        user: process.env.MAIL_USER,
                        pass: process.env.MAIL_PASS
                    }
                });
                yield transporter.sendMail({
                    from: process.env.SENDER_NAME,
                    to: email,
                    subject: title,
                    html: body
                });
            }
        }
        else {
            const transporter = nodemailer_1.default.createTransport({
                host: process.env.MAIL_HOST,
                port: 465,
                secure: true,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS
                }
            });
            yield transporter.sendMail({
                from: process.env.SENDER_NAME,
                to: emails,
                subject: title,
                html: body
            });
        }
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.mailSender = mailSender;
