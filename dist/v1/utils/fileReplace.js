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
exports.htmlToPDFAndSave = htmlToPDFAndSave;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const puppeteer_1 = __importDefault(require("puppeteer"));
function htmlToPDFAndSave(htmlContent, filePath, fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const browser = yield puppeteer_1.default.launch();
            const page = yield browser.newPage();
            // HTML contentni sahifaga yuklash
            yield page.setContent(htmlContent);
            // Sahifani PDF formatida saqlash
            const pdfBuffer = yield page.pdf({ format: 'A4' });
            yield browser.close();
            // Faylni saqlash uchun yo'l va fayl nomini aniqlash
            const outputPath = path_1.default.join(__dirname, '../../../public', 'contracts', filePath, `${fileName}`);
            // Papkani mavjudligini tekshirish va kerak bo'lsa yaratish
            const outputDir = path_1.default.dirname(outputPath);
            if (!fs_1.default.existsSync(outputDir)) {
                fs_1.default.mkdirSync(outputDir, { recursive: true });
            }
            // PDF faylni diskka yozish
            fs_1.default.writeFileSync(outputPath, pdfBuffer);
            // Nisbiy URLni qaytarish
            const relativeUrl = path_1.default.relative(path_1.default.join(__dirname, '../../../public'), outputPath);
            return `/${relativeUrl.replace(/\\/g, '/')}`;
        }
        catch (error) {
            console.log("Error", error);
        }
    });
}
