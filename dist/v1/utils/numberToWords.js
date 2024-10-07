"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numberToWordsUz = numberToWordsUz;
exports.numberToWordsRu = numberToWordsRu;
exports.formatNumber = formatNumber;
function numberToWordsUz(num) {
    const units = ["", "bir", "ikki", "uch", "to'rt", "besh", "olti", "yetti", "sakkiz", "to'qqiz"];
    const teens = ["o'n", "o'n bir", "o'n ikki", "o'n uch", "o'n to'rt", "o'n besh", "o'n olti", "o'n yetti", "o'n sakkiz", "o'n to'qqiz"];
    const tens = ["", "", "yigirma", "o'ttiz", "qirq", "ellik", "oltmish", "yetmish", "sakson", "to'qson"];
    const thousands = ["", "ming", "million", "milliard", "trillion"];
    function convert_hundreds(num) {
        let result = "";
        if (num > 99) {
            result += units[Math.floor(num / 100)] + " yuz ";
            num %= 100;
        }
        if (num > 19) {
            result += tens[Math.floor(num / 10)] + " ";
            num %= 10;
        }
        if (num > 9) {
            result += teens[num - 10] + " ";
        }
        else if (num > 0) {
            result += units[num] + " ";
        }
        return result.trim();
    }
    function convert_thousands(num) {
        let result = "";
        let thousandCounter = 0;
        while (num > 0) {
            if (num % 1000 != 0) {
                result = convert_hundreds(num % 1000) + " " + thousands[thousandCounter] + " " + result;
            }
            num = Math.floor(num / 1000);
            thousandCounter++;
        }
        return result.trim();
    }
    function convert_decimal(decimal) {
        let result = "";
        if (decimal.length > 0) {
            result = convert_hundreds(parseInt(decimal)) + " tiyin";
        }
        return result.trim();
    }
    const parts = num.toString().split(".");
    const integerPart = parseInt(parts[0]);
    const decimalPart = parts[1] ? parts[1].substring(0, 2) : "";
    let result = convert_thousands(integerPart) + " so'm";
    if (decimalPart) {
        result += " " + convert_decimal(decimalPart);
    }
    return result.trim();
}
function numberToWordsRu(num) {
    const units = ["", "один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять"];
    const teens = ["десять", "одиннадцать", "двенадцать", "тринадцать", "четырнадцать", "пятнадцать", "шестнадцать", "семнадцать", "восемнадцать", "девятнадцать"];
    const tens = ["", "", "двадцать", "тридцать", "сорок", "пятьдесят", "шестьдесят", "семьдесят", "восемьдесят", "девяносто"];
    const thousands = ["", "тысяча", "миллион", "миллиард", "триллион"];
    function convert_hundreds(num) {
        let result = "";
        if (num > 99) {
            result += units[Math.floor(num / 100)] + " сто ";
            num %= 100;
        }
        if (num > 19) {
            result += tens[Math.floor(num / 10)] + " ";
            num %= 10;
        }
        if (num > 9) {
            result += teens[num - 10] + " ";
        }
        else if (num > 0) {
            result += units[num] + " ";
        }
        return result.trim();
    }
    function convert_thousands(num) {
        let result = "";
        let thousandCounter = 0;
        while (num > 0) {
            if (num % 1000 != 0) {
                result = convert_hundreds(num % 1000) + " " + thousands[thousandCounter] + " " + result;
            }
            num = Math.floor(num / 1000);
            thousandCounter++;
        }
        return result.trim();
    }
    function convert_decimal(decimal) {
        let result = "";
        if (decimal.length > 0) {
            result = convert_hundreds(parseInt(decimal)) + " монеты";
        }
        return result.trim();
    }
    const parts = num.toString().split(".");
    const integerPart = parseInt(parts[0]);
    const decimalPart = parts[1] ? parts[1].substring(0, 2) : "";
    let result = convert_thousands(integerPart) + " сумов";
    if (decimalPart) {
        result += " " + convert_decimal(decimalPart);
    }
    return result.trim();
}
function formatNumber(num) {
    // Convert the number to a string and split it into integer and decimal parts
    const [integerPart, decimalPart] = num.toFixed(2).split('.');
    // Add spaces as thousand separators
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    // Combine the integer part with the decimal part if it exists
    return decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;
}
