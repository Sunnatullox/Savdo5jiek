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
exports.getNotificationAdmin = exports.getNotificationUser = exports.getMessagesUserByContractId = exports.getMessagesAdminByContractId = exports.sendMessageAdmin = exports.sendMessageUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const messages_service_1 = require("../services/messages.service");
const ErrorHandler_1 = __importDefault(require("../middleware/ErrorHandler"));
exports.sendMessageUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contractId, message } = req.body;
        const { id } = req.user;
        if (!contractId || !message) {
            return next(new ErrorHandler_1.default("Contract ID and message are required", 400));
        }
        const result = yield (0, messages_service_1.sendMessageUserService)(contractId, id, message);
        res.status(200).json({
            success: true,
            message: "Message sent successfully",
            data: result,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(`Error sending message: ${error.message}`, error.statusCode || 500));
    }
}));
exports.sendMessageAdmin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contractId, message } = req.body;
        const { id } = req.adminstrator;
        if (!contractId || !message) {
            return next(new ErrorHandler_1.default("Contract ID and message are required", 400));
        }
        const result = yield (0, messages_service_1.sendMessageAdminService)(id, contractId, message);
        res.status(200).json({
            success: true,
            message: "Message sent successfully",
            data: result,
        });
    }
    catch (error) {
        console.log("Message Admin Error", error);
        next(new ErrorHandler_1.default(`Error sending message: ${error.message}`, error.statusCode || 500));
    }
}));
exports.getMessagesAdminByContractId = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contractId } = req.params;
        if (!contractId) {
            return next(new ErrorHandler_1.default("Contract ID is required", 400));
        }
        const result = yield (0, messages_service_1.getMessagesAdminByContractIdService)(contractId);
        res.status(200).json({
            success: true,
            message: "Messages fetched successfully",
            data: result,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(`Error fetching messages: ${error.message}`, error.statusCode || 500));
    }
}));
exports.getMessagesUserByContractId = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contractId } = req.params;
        const { id } = req.user;
        if (!contractId) {
            return next(new ErrorHandler_1.default("Contract ID is required", 400));
        }
        const result = yield (0, messages_service_1.getMessagesUserByContractIdService)(contractId, id);
        res.status(200).json({
            success: true,
            message: "Messages fetched successfully",
            data: result,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(`Error fetching messages: ${error.message}`, error.statusCode || 500));
    }
}));
exports.getNotificationUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        const result = yield (0, messages_service_1.getNotficationUserService)(id);
        res.status(200).json({
            success: true,
            message: "Notifications fetched successfully",
            data: result,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(`Error fetching notifications: ${error.message}`, error.statusCode || 500));
    }
}));
exports.getNotificationAdmin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, messages_service_1.getNotficationAdminService)();
        res.status(200).json({
            success: true,
            message: "Notifications fetched successfully",
            data: result,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(`Error fetching notifications: ${error.message}`, error.statusCode || 500));
    }
}));
