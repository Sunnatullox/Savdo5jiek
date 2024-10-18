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
exports.createCategory = createCategory;
exports.getCategories = getCategories;
exports.getCategoriesByAdminService = getCategoriesByAdminService;
exports.getCategoryById = getCategoryById;
exports.updateCategoryById = updateCategoryById;
exports.deleteCategoryById = deleteCategoryById;
const db_1 = __importDefault(require("../config/db"));
function createCategory(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.categorie.create({
            data,
        });
    });
}
function getCategories() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.categorie.findMany();
    });
}
function getCategoriesByAdminService() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.categorie.findMany({
            select: {
                id: true,
                name_uz: true,
                name_slug_uz: true,
                createdAt: true,
                _count: {
                    select: {
                        Product: true, // This will count the number of products in each category
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    });
}
function getCategoryById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.categorie.findUnique({
            where: { id },
        });
    });
}
function updateCategoryById(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.categorie.update({
            where: { id },
            data,
        });
    });
}
function deleteCategoryById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db_1.default.product.deleteMany({
            where: {
                categoryId: id,
            },
        });
        return yield db_1.default.categorie.delete({
            where: { id },
        });
    });
}
