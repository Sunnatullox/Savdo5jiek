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
exports.deleteContactUsAdmin = exports.getSingleContactUsAdmin = exports.getContactUsListAdmin = exports.getContactUsIsNotReadAdmin = exports.createContact = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ErrorHandler_1 = __importDefault(require("../middleware/ErrorHandler"));
const contact_servoce_1 = require("../services/contact.servoce");
exports.createContact = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !email || !phone || !message) {
            return next(new ErrorHandler_1.default("All fields are required", 400));
        }
        const contactUs = yield (0, contact_servoce_1.createContactUs)({ name, email, phone, message });
        res.status(201).json({
            success: true,
            message: "Contact Us created successfully",
            contactUs,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(`Something went wrong: ${error.message}`, 500));
    }
}));
exports.getContactUsIsNotReadAdmin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contactUs = yield (0, contact_servoce_1.getContactUsList)({
            where: { isRead: false },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.status(200).json({
            success: true,
            message: "Contact Us list fetched successfully",
            contactUs,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(`Something went wrong: ${error.message}`, 500));
    }
}));
exports.getContactUsListAdmin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contactUs = yield (0, contact_servoce_1.getContactUsList)({
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.status(200).json({
            success: true,
            message: "Contact Us list fetched successfully",
            contactUs,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(`Something went wrong: ${error.message}`, 500));
    }
}));
exports.getSingleContactUsAdmin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return next(new ErrorHandler_1.default("Contact Us id is required", 400));
        }
        const contactUs = yield (0, contact_servoce_1.getContactUs)(id);
        if (!contactUs) {
            return next(new ErrorHandler_1.default("Contact Us not found", 404));
        }
        yield (0, contact_servoce_1.updateContactUs)(id, { isRead: true });
        res.status(200).json({
            success: true,
            message: "Contact Us fetched successfully",
            contactUs,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(`Something went wrong: ${error.message}`, 500));
    }
}));
exports.deleteContactUsAdmin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return next(new ErrorHandler_1.default("Contact Us id is required", 400));
        }
        const contactUs = yield (0, contact_servoce_1.getContactUs)(id);
        if (!contactUs) {
            return next(new ErrorHandler_1.default("Contact Us not found", 404));
        }
        yield (0, contact_servoce_1.deleteContactUs)(id);
        res.status(200).json({
            success: true,
            message: "Contact Us deleted successfully",
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(`Something went wrong: ${error.message}`, 500));
    }
}));
