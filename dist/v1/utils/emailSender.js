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
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailSender = void 0;
const mailSender = (email, title, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { SMTPClient } = yield import('emailjs');
        const client = new SMTPClient({
            user: process.env.MAIL_USER, // Sizning Gmail manzilingiz
            password: process.env.MAIL_PASS, // Yaratilgan app parol
            host: process.env.MAIL_HOST, // Gmail SMTP server
            ssl: true // SSL orqali ulanish
        });
        const message = yield client.sendAsync({
            from: process.env.MAIL_USER, // Kimdan
            to: email, // Kimga
            subject: title, // Xat mavzusi
            text: body,
            html: body,
            attachment: [{
                    data: body,
                    alternative: true,
                }], // Xat matni
        });
        return message;
    }
    catch (error) {
        console.error("Failed to send mail", error);
        throw error; // Bu yerda to'liq xatolik ob'ektini qaytarish yaxshiroq bo'ladi
    }
});
exports.mailSender = mailSender;
// const transporter = nodemailer.createTransport({
//   service: "Gmail", 
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASS,
//   },
// });
// const info = await transporter.sendMail({
//   from: process.env.SENDER_EMAIL,
//   to: email,
//   subject: title,
//   html: body,
// });
// console.log("Mail sent successfully", info);
// return info;
