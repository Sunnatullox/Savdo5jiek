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
exports.createProductService = createProductService;
exports.getProductsService = getProductsService;
exports.getProductByIdService = getProductByIdService;
exports.updateProductService = updateProductService;
exports.deleteProductService = deleteProductService;
const db_1 = __importDefault(require("../config/db"));
const ErrorHandler_1 = __importDefault(require("../middleware/ErrorHandler"));
function createProductService(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.product.create({
            data,
        });
    });
}
function getProductsService(page, limit, search, categorie) {
    return __awaiter(this, void 0, void 0, function* () {
        let categoryFilter = {};
        if (categorie) {
            const findCategory = yield db_1.default.categorie.findFirst({
                where: {
                    OR: [
                        { name_uz: { contains: categorie } },
                        { name_ru: { contains: categorie } },
                        { name_en: { contains: categorie } },
                        { name_slug_en: { contains: categorie } },
                        { name_slug_ru: { contains: categorie } },
                        { name_slug_uz: { contains: categorie } },
                    ],
                },
            });
            if (!findCategory) {
                throw new ErrorHandler_1.default("Category not found", 404);
            }
            categoryFilter = { categoryId: findCategory.id };
        }
        const products = yield db_1.default.product.findMany({
            where: Object.assign({ OR: [
                    { name_uz: { contains: search } },
                    { name_ru: { contains: search } },
                    { name_en: { contains: search } },
                    { description_uz: { contains: search } },
                    { description_ru: { contains: search } },
                    { description_en: { contains: search } },
                ] }, categoryFilter),
            include: {
                category: true,
            },
            skip: (page - 1) * limit,
            take: limit,
        });
        return products;
    });
}
function getProductByIdService(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const product = yield db_1.default.product.findUnique({
            where: { id },
            include: {
                category: true,
            },
        });
        if (!product) {
            throw new ErrorHandler_1.default("Product not found", 404);
        }
        return product;
    });
}
function updateProductService(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.product.update({
            where: { id },
            data,
        });
    });
}
function deleteProductService(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.product.delete({
            where: { id },
        });
    });
}
