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
exports.getLowStockProductsService = exports.getUserAnalyticsService = exports.get12MonthProductSalesAnalyticsService = exports.get12MonthContractAnalyticsService = void 0;
const db_1 = __importDefault(require("../config/db"));
const get12MonthContractAnalyticsService = () => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    const lastYear = new Date(today.setFullYear(today.getFullYear() - 1));
    const contracts = yield db_1.default.contract.findMany({
        where: {
            createdAt: {
                gte: lastYear,
            },
        },
        include: {
            Payment: true,
        },
    });
    const monthlyData = contracts.reduce((acc, contract) => {
        const month = contract.createdAt.getMonth();
        if (!acc[month]) {
            acc[month] = { totalContracts: 0, totalAmount: 0, approvedPayments: 0 };
        }
        acc[month].totalContracts++;
        acc[month].totalAmount += contract.totalPrice;
        contract.Payment.forEach((payment) => {
            if (payment.status === "approved") {
                acc[month].approvedPayments++;
            }
        });
        return acc;
    }, {});
    return monthlyData;
});
exports.get12MonthContractAnalyticsService = get12MonthContractAnalyticsService;
const get12MonthProductSalesAnalyticsService = () => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    const lastYear = new Date(today.setFullYear(today.getFullYear() - 1));
    const salesData = yield db_1.default.contract.findMany({
        where: {
            createdAt: {
                gte: lastYear,
            },
            status: "approved", // Assuming you only want to analyze approved contracts
        },
        include: {
            Payment: {
                where: {
                    status: "approved",
                },
            },
        },
    });
    const monthlyProductData = salesData.reduce((acc, contract) => {
        const month = contract.createdAt.getMonth();
        const products = typeof contract.products === "string"
            ? JSON.parse(contract.products)
            : contract.products;
        products.forEach((product) => {
            const productId = product.id;
            const stock = product.stock;
            if (!acc[productId]) {
                acc[productId] = Array(12).fill(0);
            }
            acc[productId][month] += stock;
        });
        return acc;
    }, {});
    return monthlyProductData;
});
exports.get12MonthProductSalesAnalyticsService = get12MonthProductSalesAnalyticsService;
const getUserAnalyticsService = () => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    const lastYear = new Date(today.setFullYear(today.getFullYear() - 1));
    // Fetch users created in the last 12 months
    const users = yield db_1.default.user.findMany({
        where: {
            createdAt: {
                gte: lastYear,
            },
        },
    });
    // Aggregate monthly user registrations
    const monthlyRegistrations = users.reduce((acc, user) => {
        const month = user.createdAt.getMonth();
        acc[month] = (acc[month] || 0) + 1;
        return acc;
    }, Array(12).fill(0));
    // Fetch contracts and payments for these users
    const contracts = yield db_1.default.contract.findMany({
        where: {
            createdAt: {
                gte: lastYear,
            },
        },
        include: {
            Payment: true,
        },
    });
    // Aggregate contracts and payments by user
    const userContracts = {};
    contracts.forEach((contract) => {
        const month = contract.createdAt.getMonth();
        if (!userContracts[contract.userId]) {
            userContracts[contract.userId] = {
                totalContracts: 0,
                monthlyPayments: Array(12).fill(0),
            };
        }
        userContracts[contract.userId].totalContracts++;
        contract.Payment.forEach((payment) => {
            userContracts[contract.userId].monthlyPayments[month] += payment.amount;
        });
    });
    return {
        monthlyRegistrations,
        userContracts,
    };
});
exports.getUserAnalyticsService = getUserAnalyticsService;
const getLowStockProductsService = () => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield db_1.default.product.findMany({
        where: {
            stock: {
                lt: 100, // Less than 100 units in stock
            },
        },
        orderBy: {
            stock: 'asc', // Order by ascending stock
        },
    });
    const highlightedProducts = products.map((product) => {
        let color = 'yellow'; // Default to yellow
        if (product.stock < 50) {
            color = 'red'; // Set to red if stock is less than 50
        }
        return Object.assign(Object.assign({}, product), { color });
    });
    return highlightedProducts;
});
exports.getLowStockProductsService = getLowStockProductsService;
