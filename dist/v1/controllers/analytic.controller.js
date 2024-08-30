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
exports.getLowStockProducts = exports.getUserAnalytics = exports.get12MonthProductSalesAnalytics = exports.get12MonthContractAnalytics = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ErrorHandler_1 = __importDefault(require("../middleware/ErrorHandler"));
const analitc_service_1 = require("../services/analitc.service");
exports.get12MonthContractAnalytics = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const analytics = yield (0, analitc_service_1.get12MonthContractAnalyticsService)();
        res.status(200).json({
            success: true,
            analytics,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(`Please try again later ${error.message}`, 500));
    }
}));
exports.get12MonthProductSalesAnalytics = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const analytics = yield (0, analitc_service_1.get12MonthProductSalesAnalyticsService)();
        res.status(200).json({
            success: true,
            analytics,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(`Please try again later ${error.message}`, 500));
    }
}));
exports.getUserAnalytics = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const analytics = yield (0, analitc_service_1.getUserAnalyticsService)();
        res.status(200).json({
            success: true,
            analytics,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(`Please try again later ${error.message}`, 500));
    }
}));
exports.getLowStockProducts = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield (0, analitc_service_1.getLowStockProductsService)();
        res.status(200).json({
            success: true,
            products,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(`Please try again later ${error.message}`, 500));
    }
}));
