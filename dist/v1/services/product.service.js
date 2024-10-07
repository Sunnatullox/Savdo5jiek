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
exports.getTopProductsService = getTopProductsService;
exports.getNewProductsService = getNewProductsService;
exports.getProductsByAdminService = getProductsByAdminService;
exports.getProductByIdService = getProductByIdService;
exports.updateProductService = updateProductService;
exports.updateProductStatusService = updateProductStatusService;
exports.deleteProductService = deleteProductService;
const db_1 = __importDefault(require("../config/db"));
const ErrorHandler_1 = __importDefault(require("../middleware/ErrorHandler"));
function createProductService(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield db_1.default.product.create({
                data,
            });
        }
        catch (error) {
            console.error(`Error creating product: ${error.message}`);
            throw new ErrorHandler_1.default("Error creating product", 500);
        }
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
            where: Object.assign({ status: true, OR: [
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
function getTopProductsService() {
    return __awaiter(this, void 0, void 0, function* () {
        // Contractlardan tasdiqlangan mahsulotlarni olish
        const approvedContracts = yield db_1.default.contract.findMany({
            where: {
                status: "approved",
            },
            select: {
                products: true,
            },
        });
        // Mahsulotlar bo'yicha sotilgan sonini hisoblash
        const productSalesCount = {};
        console.log(approvedContracts);
        approvedContracts.forEach((contract) => {
            const products = typeof contract.products === "string"
                ? JSON.parse(contract.products)
                : contract.products;
            products.forEach((product) => {
                if (productSalesCount[product.id]) {
                    productSalesCount[product.id] += product.qty;
                }
                else {
                    productSalesCount[product.id] = product.qty;
                }
            });
        });
        // Eng ko'p sotilgan 20 ta mahsulotni topish
        const topProductIds = Object.entries(productSalesCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 20)
            .map(([productId]) => productId);
        // Topilgan mahsulotlarni ma'lumotlar bazasidan olish
        const topProducts = yield db_1.default.product.findMany({
            where: {
                id: { in: topProductIds },
            },
            include: {
                category: true,
            },
        });
        return topProducts;
    });
}
function getNewProductsService() {
    return __awaiter(this, void 0, void 0, function* () {
        const today = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 1);
        const newProducts = yield db_1.default.product.findMany({
            where: {
                createdAt: {
                    gte: oneMonthAgo,
                },
            },
            include: {
                category: true,
            },
        });
        return newProducts;
    });
}
function getProductsByAdminService() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.product.findMany({
            include: {
                category: true,
            },
        });
    });
}
function getProductByIdService(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
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
        }
        catch (error) {
            console.error(`Error fetching product by ID: ${error.message}`);
            throw new ErrorHandler_1.default("Error fetching product", 500);
        }
    });
}
function updateProductService(prisma, id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.product.update({
            where: { id },
            data,
        });
    });
}
function updateProductStatusService(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const product = yield db_1.default.product.findUnique({
            where: { id },
        });
        if (!product) {
            throw new ErrorHandler_1.default("Product not found", 404);
        }
        return yield db_1.default.product.update({
            where: { id },
            data: { status: !product.status },
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
