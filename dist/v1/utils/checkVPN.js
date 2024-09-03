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
const axios_1 = __importDefault(require("axios"));
const ErrorHandler_1 = __importDefault(require("../middleware/ErrorHandler"));
const request_ip_1 = require("request-ip");
const checkVPN = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const ip = (0, request_ip_1.getClientIp)(req) || "";
    try {
        // IP manzilini tekshirish uchun tashqi API dan foydalanish
        const response = yield axios_1.default.get(`https://ipinfo.io/${ip}/json`);
        const { country, org } = response.data;
        if (!org || !country) {
            console.log(`Organization data not available for IP: ${ip}`);
            return next();
        }
        if (org.includes("VPN") || org.includes("Proxy")) {
            return res.status(403).json({ error: "VPN is not allowed" });
        }
        const countr = ["UZ", "RU", "KZ", "TJ", "KG"];
        if (!countr.includes(country.toUpperCase())) {
            return res.status(403).json({ error: "Country is not allowed" });
        }
        next();
    }
    catch (error) {
        console.error("Error checking IP:", error);
        next(new ErrorHandler_1.default(`Error checking IP: ${error}`, 500));
    }
});
exports.default = checkVPN;
