import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

export async function htmlToPDFAndSave(htmlContent: string, filePath: string, fileName: string) {
    try {
        if(!htmlContent) throw new Error("Html content is required");
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
    
        // HTML contentni sahifaga yuklash
        await page.setContent(htmlContent);
    
        // Sahifani PDF formatida saqlash
        const pdfBuffer = await page.pdf({ format: 'A4' });
    
        await browser.close();
    
        // Faylni saqlash uchun yo'l va fayl nomini aniqlash
        const outputPath = path.join(__dirname, '../../../public', 'contracts', filePath, `${fileName}`);
    
        // Papkani mavjudligini tekshirish va kerak bo'lsa yaratish
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
    
        // PDF faylni diskka yozish
        fs.writeFileSync(outputPath, pdfBuffer);
    
        // Nisbiy URLni qaytarish
        const relativeUrl = path.relative(path.join(__dirname, '../../../public'), outputPath);
        return `/${relativeUrl.replace(/\\/g, '/')}`;
    } catch (error) {
        console.log("Error", error);
    }
}