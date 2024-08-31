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
exports.deleteCategory = exports.updateCategory = exports.getCategory = exports.getCategories = exports.createCategoryAdmin = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ErrorHandler_1 = __importDefault(require("../middleware/ErrorHandler"));
const slugify_1 = __importDefault(require("slugify"));
const category_service_1 = require("../services/category.service");
exports.createCategoryAdmin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name_uz, name_ru, name_en } = req.body;
        if (!name_uz) {
            return next(new ErrorHandler_1.default("Name_uz is required", 400));
        }
        const name_slug_uz = (0, slugify_1.default)(name_uz, { lower: true });
        const name_slug_ru = name_ru ? (0, slugify_1.default)(name_ru, { lower: true }) : name_slug_uz;
        const name_slug_en = name_en ? (0, slugify_1.default)(name_en, { lower: true }) : name_slug_uz;
        const category = yield (0, category_service_1.createCategory)({
            name_uz,
            name_slug_uz,
            name_ru: name_ru || name_uz,
            name_slug_ru,
            name_en: name_en || name_uz,
            name_slug_en,
        });
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(`Error creating category: ${error.message}`, 500));
    }
}));
exports.getCategories = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield (0, category_service_1.getCategories)();
        res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            categories,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(`Error fetching categories: ${error.message}`, 500));
    }
}));
exports.getCategory = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const category = yield (0, category_service_1.getCategoryById)(id);
        if (!category) {
            return next(new ErrorHandler_1.default("Category not found", 404));
        }
        res.status(200).json({
            success: true,
            message: "Category fetched successfully",
            category,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(`Error fetching category: ${error.message}`, 500));
    }
}));
exports.updateCategory = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name_uz, name_ru, name_en } = req.body;
        if (!name_uz) {
            return next(new ErrorHandler_1.default("Name_uz is required", 400));
        }
        const category = yield (0, category_service_1.updateCategoryById)(id, {
            name_uz,
            name_ru: name_ru || name_uz,
            name_en: name_en || name_uz,
        });
        if (!category) {
            return next(new ErrorHandler_1.default("Category not found", 404));
        }
        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(`Error updating category: ${error.message}`, 500));
    }
}));
exports.deleteCategory = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const category = yield (0, category_service_1.deleteCategoryById)(id);
        if (!category) {
            return next(new ErrorHandler_1.default("Category not found", 404));
        }
        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(`Error deleting category: ${error.message}`, 500));
    }
}));
