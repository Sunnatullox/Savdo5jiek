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
exports.deleteProductByAdmin = exports.updateProductStatusByAdmin = exports.updateProductByAdmin = exports.getProductById = exports.getProductsByAdmin = exports.getProductsDiscount = exports.getNewProducts = exports.getTopProducts = exports.getProducts = exports.createProductByAdmin = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ErrorHandler_1 = __importDefault(require("../middleware/ErrorHandler"));
const product_service_1 = require("../services/product.service");
const db_1 = __importDefault(require("../config/db"));
exports.createProductByAdmin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name_uz, name_ru, name_en, description_uz, description_ru, description_en, price, discount, categoryId, stock, unit_uz, unit_ru, unit_en, delivery_price, } = req.body;
        if (!name_uz || !description_uz || !price || !categoryId || !unit_uz || !stock) {
            return next(new ErrorHandler_1.default("Name, description, price, category, unit and stock are required", 400));
        }
        if (stock && stock <= 0) {
            return next(new ErrorHandler_1.default("Stock must be greater than 0", 400));
        }
        const images = req.files;
        if (!images || images.length <= 0 || images.length > 5) {
            return next(new ErrorHandler_1.default("Image must be 5 or less", 400));
        }
        const imagesPath = images.map(file => `${req.protocol}://${req.get("host")}/public/imgs/${file.filename}`);
        const createProduct = yield (0, product_service_1.createProductService)({
            name_uz,
            name_ru: name_ru || name_uz,
            name_en: name_en || name_uz,
            description_uz,
            description_ru: description_ru || description_uz,
            description_en: description_en || description_uz,
            price: Number(price),
            discount: Number(discount),
            image: imagesPath,
            stock: Number(stock),
            unit_uz,
            unit_ru: unit_ru || unit_uz,
            unit_en: unit_en || unit_uz,
            categoryId,
            status: true,
            delivery_price: Number(delivery_price)
        });
        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: createProduct,
        });
    }
    catch (error) {
        console.log("Error creating product", error);
        return next(new ErrorHandler_1.default(`Error creating product: ${error.message}`, 500));
    }
}));
exports.getProducts = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const categorie = req.query.categorie || "";
        const total = yield db_1.default.product.count();
        const products = yield (0, product_service_1.getProductsService)(page, limit, search, categorie);
        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: products,
            pagination: {
                page: page,
                limit: limit,
                total: total,
                pages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        console.error(`Error getting products: ${error.message}`); // Log the error
        return next(new ErrorHandler_1.default(`Error getting products: ${error.message}`, error.statusCode || 500));
    }
}));
exports.getTopProducts = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield (0, product_service_1.getTopProductsService)();
        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: products,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(`Error getting products: ${error.message}`, 500));
    }
}));
exports.getNewProducts = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield (0, product_service_1.getNewProductsService)();
        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: products,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(`Error getting products: ${error.message}`, 500));
    }
}));
exports.getProductsDiscount = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield (0, product_service_1.getProductsDiscountService)();
        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: products,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(`Error getting products: ${error.message}`, 500));
    }
}));
exports.getProductsByAdmin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield (0, product_service_1.getProductsByAdminService)();
        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: products,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(`Error getting products: ${error.message}`, 500));
    }
}));
exports.getProductById = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return next(new ErrorHandler_1.default("Product id is required", 400));
        }
        const product = yield (0, product_service_1.getProductByIdService)(id);
        if (!product) {
            return next(new ErrorHandler_1.default("Product not found", 404));
        }
        res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data: product,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(`Error getting product: ${error.message}`, 500));
    }
}));
exports.updateProductByAdmin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return next(new ErrorHandler_1.default("Product id is required", 400));
        }
        const { name_uz, name_ru, name_en, description_uz, description_ru, description_en, price, discount, categoryId, stock, unit_uz, unit_ru, unit_en, delivery_price, oldImages = [] } = req.body;
        db_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const images = req.files;
            let imagesPath = [];
            if ((images === null || images === void 0 ? void 0 : images.length) > 0) {
                imagesPath = yield Promise.all(images.map((file) => __awaiter(void 0, void 0, void 0, function* () { return `${req.protocol}://${req.get("host")}/public/imgs/${file.filename}`; })));
            }
            const findProduct = yield (0, product_service_1.getProductByIdService)(id);
            if (!findProduct) {
                return next(new ErrorHandler_1.default("Product not found", 404));
            }
            if (imagesPath.length > 0 || oldImages.length > 0) {
                const oldImgFindAndDelete = findProduct.image.filter((oldImg) => !oldImages.includes(oldImg));
                if (oldImgFindAndDelete.length > 0) {
                    for (const oldImgDelete of oldImgFindAndDelete) {
                        if (oldImgDelete === undefined) {
                            continue;
                        }
                        const fileName = oldImgDelete.split("public/imgs/")[1];
                        const filePath = path_1.default.join(__dirname, `../public/imgs/${fileName}`);
                        fs_1.default.unlink(filePath, err => {
                            if (err && err.code !== 'ENOENT') {
                                throw err;
                            }
                        });
                    }
                }
            }
            const product_img = typeof oldImages === "string"
                ? [oldImages, ...(imagesPath || [])]
                : [...(oldImages || []), ...(imagesPath || [])];
            const updatedProduct = yield (0, product_service_1.updateProductService)(tx, id, {
                name_uz: name_uz || findProduct.name_uz,
                name_ru: name_ru || findProduct.name_ru,
                name_en: name_en || findProduct.name_en,
                description_uz: description_uz || findProduct.description_uz,
                description_ru: description_ru || findProduct.description_ru,
                description_en: description_en || findProduct.description_en,
                price: price !== undefined ? Number(price) : findProduct.price,
                discount: discount !== undefined ? Number(discount) : findProduct.discount,
                categoryId: categoryId || findProduct.categoryId,
                image: product_img,
                stock: stock !== undefined ? Number(stock) : findProduct.stock,
                unit_uz: unit_uz || findProduct.unit_uz,
                unit_ru: unit_ru || findProduct.unit_ru,
                unit_en: unit_en || findProduct.unit_en,
                delivery_price: delivery_price !== undefined ? Number(delivery_price) : findProduct.delivery_price
            });
            res.status(200).json({
                success: true,
                message: "Product updated successfully",
                data: updatedProduct,
            });
        }));
    }
    catch (error) {
        console.log("Error updating product", error);
        return next(new ErrorHandler_1.default(`Error updating product: ${error.message}`, 500));
    }
}));
exports.updateProductStatusByAdmin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return next(new ErrorHandler_1.default("Product id is required", 400));
        }
        const updatedProduct = yield (0, product_service_1.updateProductStatusService)(id);
        res.status(200).json({
            success: true,
            message: "Product status updated successfully",
            data: updatedProduct,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(`Error updating product status: ${error.message}`, 500));
    }
}));
exports.deleteProductByAdmin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return next(new ErrorHandler_1.default("Product id is required", 400));
        }
        const findProduct = yield (0, product_service_1.getProductByIdService)(id);
        if (!findProduct) {
            return next(new ErrorHandler_1.default("Product not found", 404));
        }
        if (findProduct.image.length > 0) {
            const deleteImagePromises = findProduct.image.map(image => {
                const fileName = image.split("public/imgs/")[1];
                const filePath = path_1.default.join(__dirname, `../public/imgs/${fileName}`);
                return fs_1.default.promises.unlink(filePath).catch(err => {
                    if (err && err.code !== 'ENOENT') {
                        throw err;
                    }
                });
            });
            yield Promise.all(deleteImagePromises);
        }
        yield (0, product_service_1.deleteProductService)(id);
        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(`Error deleting product: ${error.message}`, 500));
    }
}));
