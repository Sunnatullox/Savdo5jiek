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
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const currentMonth = today.getMonth();
    const orderedMonthNames = [
        ...monthNames.slice(currentMonth),
        ...monthNames.slice(0, currentMonth),
    ];
    const monthlyData = Array.from({ length: 12 }, (_, index) => ({
        month: orderedMonthNames[index],
        totalContracts: 0,
        totalAmount: 0,
        approvedPayments: 0,
    }));
    contracts.forEach((contract) => {
        const month = (contract.createdAt.getMonth() - currentMonth + 12) % 12;
        monthlyData[month].totalContracts++;
        monthlyData[month].totalAmount += contract.totalPrice;
        contract.Payment.forEach((payment) => {
            const typedPayment = payment;
            if (typedPayment.status === "approved") {
                monthlyData[month].approvedPayments++;
            }
        });
    });
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
            status: "approved",
        },
        include: {
            Payment: {
                where: {
                    status: "approved",
                },
            },
        },
    });
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const currentMonth = today.getMonth();
    const orderedMonthNames = [
        ...monthNames.slice(currentMonth),
        ...monthNames.slice(0, currentMonth),
    ];
    const initializeMonthlyData = () => {
        return Array.from({ length: 12 }, (_, index) => ({
            month: orderedMonthNames[index],
            products: [],
        }));
    };
    const calculateTotalSales = (product) => {
        return product.discount > 0
            ? product.discount * product.qty
            : product.price * product.qty;
    };
    const updateMonthlyData = (monthlyData, contract, month) => {
        const products = typeof contract.products === "string"
            ? JSON.parse(contract.products)
            : contract.products;
        products.forEach((product) => {
            const { id: productId, name_uz: productName, qty: unitsSold } = product;
            const totalSales = calculateTotalSales(product);
            const existingProduct = monthlyData[month].products.find((p) => p.productId === productId);
            if (existingProduct) {
                existingProduct.unitsSold += unitsSold;
                existingProduct.totalSales += totalSales;
            }
            else {
                monthlyData[month].products.push({
                    productId,
                    productName,
                    unitsSold,
                    totalSales,
                });
            }
        });
    };
    const monthlyData = initializeMonthlyData();
    salesData.forEach((contract) => {
        const month = (contract.createdAt.getMonth() - currentMonth + 12) % 12;
        updateMonthlyData(monthlyData, contract, month);
    });
    return monthlyData;
});
exports.get12MonthProductSalesAnalyticsService = get12MonthProductSalesAnalyticsService;
const getUserAnalyticsService = () => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    const lastYear = new Date(today.setFullYear(today.getFullYear() - 1));
    const users = yield db_1.default.user.findMany({
        where: {
            createdAt: {
                gte: lastYear,
            },
        },
        include: {
            Contract: {
                where: {
                    status: 'approved',
                    createdAt: {
                        gte: lastYear,
                    }
                },
                include: {
                    Payment: {
                        where: {
                            status: 'approved',
                        }
                    }
                }
            },
            legal_info: true
        }
    });
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const currentMonth = today.getMonth();
    const orderedMonthNames = [
        ...monthNames.slice(currentMonth),
        ...monthNames.slice(0, currentMonth),
    ];
    const monthlyData = Array.from({ length: 12 }, (_, index) => ({
        month: orderedMonthNames[index],
        users: [],
    }));
    users.forEach(user => {
        user.Contract.forEach(contract => {
            var _a;
            const month = (contract.createdAt.getMonth() - currentMonth + 12) % 12;
            const totalPayments = contract.Payment.reduce((sum, payment) => sum + payment.amount, 0);
            const userEntry = monthlyData[month].users.find(u => u.userId === user.id);
            if (userEntry) {
                userEntry.totalContracts++;
                userEntry.totalPayments += totalPayments;
            }
            else {
                monthlyData[month].users.push({
                    userId: user.id,
                    userName: user.full_name,
                    totalContracts: 1,
                    totalPayments: totalPayments,
                    phoneNumber: user.is_LLC ? (_a = user.legal_info) === null || _a === void 0 ? void 0 : _a.phone_number : user.phone_number
                });
            }
        });
    });
    return monthlyData;
});
exports.getUserAnalyticsService = getUserAnalyticsService;
const getLowStockProductsService = () => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield db_1.default.product.findMany({
        where: {
            stock: {
                lt: 100,
            },
        },
        orderBy: {
            stock: "asc",
        },
    });
    return products.map((product) => (Object.assign(Object.assign({}, product), { color: product.stock < 50 ? "red" : "yellow" })));
});
exports.getLowStockProductsService = getLowStockProductsService;
