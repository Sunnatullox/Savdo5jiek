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
exports.getNotificationPaymentByAdmin = exports.deletePaymentByAdmin = exports.deletePaymentByUser = exports.updatePaymentStatus = exports.updatePaymentByAdmin = exports.updatePaymentByUser = exports.getPaymentsByContractIdAdmin = exports.getPaymentByAdmin = exports.getPaymentsByContractId = exports.getPaymentById = exports.createPaymentUser = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ErrorHandler_1 = __importDefault(require("../middleware/ErrorHandler"));
const payment_service_1 = require("../services/payment.service");
const contract_service_1 = require("../services/contract.service");
const product_service_1 = require("../services/product.service");
exports.createPaymentUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { amount, paidDate } = req.body;
        const { user } = req;
        const { file } = req;
        if (!user) {
            return next(new ErrorHandler_1.default("Please login to continue", 404));
        }
        if (!id || !amount || !file || !paidDate) {
            return next(new ErrorHandler_1.default("All fields are required", 400));
        }
        const imagePath = `${req.protocol}://${req.get("host")}/public/payments/${file.filename}`;
        const findContract = yield (0, contract_service_1.getContractByIdService)(id, user.id);
        if (!findContract) {
            return next(new ErrorHandler_1.default("Invalid contract ID or the contract doesn't belong to you", 404));
        }
        const payment = yield (0, payment_service_1.createPayment)({
            amount,
            paidDate,
            receiptImage: imagePath,
            user: { connect: { id: user.id } },
            contract: { connect: { id } },
        });
        res.status(201).json({
            success: true,
            message: "Payment created successfully",
            payment,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(`Create Payment Error: ${error.message}`, 500));
    }
}));
exports.getPaymentById = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req;
        const { id } = req.params;
        if (!user) {
            return next(new ErrorHandler_1.default("Please login to continue", 404));
        }
        if (!id) {
            return next(new ErrorHandler_1.default("Payment id is required", 400));
        }
        const payment = yield (0, payment_service_1.getPaymentByIdService)(id, user.id);
        if (!payment) {
            return next(new ErrorHandler_1.default("Payment not found", 404));
        }
        res.status(200).json({
            success: true,
            message: "Payment fetched successfully",
            payment,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(`Get Payment Error: ${error.message}`, 500));
    }
}));
exports.getPaymentsByContractId = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { user } = req;
        if (!user) {
            return next(new ErrorHandler_1.default("Please login to continue", 404));
        }
        if (!id) {
            return next(new ErrorHandler_1.default("Contract id is required", 400));
        }
        const payments = yield (0, payment_service_1.getPaymentsByUserIdService)(id, user.id);
        res.status(200).json({
            success: true,
            message: "Payments fetched successfully",
            payments,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(`Get Payments Error: ${error.message}`, 500));
    }
}));
exports.getPaymentByAdmin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const payments = yield (0, payment_service_1.getPaymentByIdService)(id);
        if (!payments) {
            return next(new ErrorHandler_1.default("Payment not found", 404));
        }
        if (payments.isRead === false) {
            yield (0, payment_service_1.updatePayment)(payments.id, { isRead: true });
        }
        res.status(200).json({
            success: true,
            message: "Payment fetched successfully",
            payments,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(`Get Payments Error: ${error.message}`, 500));
    }
}));
exports.getPaymentsByContractIdAdmin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const payments = yield (0, payment_service_1.getPaymentsByContractIdAdminService)(id);
        res.status(200).json({
            success: true,
            message: "Payments fetched successfully",
            payments,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(`Get Payments Error: ${error.message}`, 500));
    }
}));
exports.updatePaymentByUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { amount, paidDate } = req.body;
        const { user } = req;
        const { file } = req;
        if (!user) {
            return next(new ErrorHandler_1.default("Please login to continue", 404));
        }
        if (!amount || !paidDate) {
            return next(new ErrorHandler_1.default("All fields are required", 400));
        }
        const findPayment = yield (0, payment_service_1.getPaymentByIdService)(id, user.id);
        if (!findPayment) {
            return next(new ErrorHandler_1.default("Payment not found", 404));
        }
        if (findPayment.status === "approved") {
            return next(new ErrorHandler_1.default("Payment cannot be updated, it is approved", 400));
        }
        let updateData = { amount, paidDate };
        if (file) {
            const imagePath = `${req.protocol}://${req.get("host")}/public/payments/${file.filename}`;
            updateData.receiptImage = imagePath;
            if (findPayment.receiptImage) {
                const filename = findPayment.receiptImage.split('/public/payments/')[1];
                const filePath = path_1.default.join(__dirname, '../../../public/payments', filename);
                fs_1.default.unlink(filePath, (err) => {
                    if (err) {
                        console.error("Failed to delete image file:", err);
                    }
                });
            }
        }
        const payment = yield (0, payment_service_1.updatePayment)(id, updateData, user.id);
        if (!payment) {
            return next(new ErrorHandler_1.default("Sorry, payment not updated, please try again", 404));
        }
        res.status(200).json({
            success: true,
            message: "Payment updated successfully",
            payment,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(`Update Payment Error: ${error.message}`, 500));
    }
}));
exports.updatePaymentByAdmin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { amount, paidDate } = req.body;
        if (!amount || !paidDate) {
            return next(new ErrorHandler_1.default("All fields are required", 400));
        }
        const payment = yield (0, payment_service_1.updatePayment)(id, { amount, paidDate });
        if (!payment) {
            return next(new ErrorHandler_1.default("Sorry, payment not updated, please try again", 404));
        }
        res.status(200).json({
            success: true,
            message: "Payment updated successfully",
            payment,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(`Update Payment Error: ${error.message}`, 500));
    }
}));
exports.updatePaymentStatus = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Payment ID
        const { status } = req.body;
        if (!status) {
            return next(new ErrorHandler_1.default("Status is required", 400));
        }
        const payment = yield (0, payment_service_1.getPaymentByIdService)(id);
        if (!payment) {
            return next(new ErrorHandler_1.default("Payment not found", 404));
        }
        const contract = yield (0, contract_service_1.getContractByIdService)(payment.contractId);
        if (!contract) {
            return next(new ErrorHandler_1.default("Contract not found", 404));
        }
        let updatedPaidAmount = contract.paidAmount;
        let paidPercent = (updatedPaidAmount / contract.totalPrice) * 100;
        if (status === "approved") {
            updatedPaidAmount += payment.amount;
            paidPercent = (updatedPaidAmount / contract.totalPrice) * 100;
            yield (0, contract_service_1.updateContractService)(payment.contractId, {
                paidAmount: updatedPaidAmount,
                paidPercent,
                status: "approved",
            });
            if (paidPercent >= 30) {
                const productsInContract = typeof contract.products === "string"
                    ? JSON.parse(contract.products)
                    : contract.products;
                for (const product of productsInContract) {
                    const existingProduct = yield (0, product_service_1.getProductByIdService)(product.id);
                    if (existingProduct && existingProduct.stock >= product.qty) {
                        yield (0, product_service_1.updateProductService)(product.id, {
                            stock: existingProduct.stock - product.qty,
                        });
                    }
                }
            }
        }
        else if (status === "rejected") {
            updatedPaidAmount -= payment.amount;
            paidPercent = (updatedPaidAmount / contract.totalPrice) * 100;
            yield (0, contract_service_1.updateContractService)(payment.contractId, {
                paidAmount: updatedPaidAmount,
                paidPercent,
                status: "rejected",
            });
            const productsInContract = typeof contract.products === "string"
                ? JSON.parse(contract.products)
                : contract.products;
            for (const product of productsInContract) {
                const existingProduct = yield (0, product_service_1.getProductByIdService)(product.id);
                if (existingProduct) {
                    yield (0, product_service_1.updateProductService)(product.id, {
                        stock: existingProduct.stock + product.qty,
                    });
                }
            }
        }
        const updatedPayment = yield (0, payment_service_1.updatePayment)(id, { status });
        if (!updatedPayment) {
            return next(new ErrorHandler_1.default("Sorry, payment not updated, please try again", 404));
        }
        res.status(200).json({
            success: true,
            message: "Payment status updated successfully",
            payment: updatedPayment,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(`Update Payment Error: ${error.message}`, 500));
    }
}));
exports.deletePaymentByUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { user } = req;
        if (!user) {
            return next(new ErrorHandler_1.default("Please login to continue", 404));
        }
        const payment = yield (0, payment_service_1.getPaymentByIdService)(id, user.id);
        if (!payment) {
            return next(new ErrorHandler_1.default("Payment not found", 404));
        }
        if (payment.status === "approved") {
            return next(new ErrorHandler_1.default("Payment cannot be deleted, it is approved", 400));
        }
        if (payment.receiptImage) {
            const filename = payment.receiptImage.split('/public/payments/')[1];
            const filePath = path_1.default.join(__dirname, '../../../public/payments', filename);
            fs_1.default.promises.unlink(filePath).catch(err => {
                console.error("Failed to delete image file:", err);
            });
        }
        yield (0, payment_service_1.deletePayment)(id);
        res.status(200).json({
            success: true,
            message: "Payment deleted successfully",
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(`Delete Payment Error: ${error.message}`, 500));
    }
}));
exports.deletePaymentByAdmin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return next(new ErrorHandler_1.default("Payment id is required", 400));
        }
        const payment = yield (0, payment_service_1.getPaymentByIdService)(id);
        if (!payment) {
            return next(new ErrorHandler_1.default("Payment not found", 404));
        }
        if (payment.status === "approved") {
            return next(new ErrorHandler_1.default("Payment cannot be deleted, it is approved", 400));
        }
        if (payment.receiptImage) {
            const filename = payment.receiptImage.split('/public/payments/')[1];
            const filePath = path_1.default.join(__dirname, '../../../public/payments', filename);
            yield fs_1.default.promises.unlink(filePath).catch(err => {
                console.error("Failed to delete image file:", err);
            });
        }
        yield (0, payment_service_1.deletePayment)(id);
        res.status(200).json({
            success: true,
            message: "Payment deleted successfully",
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(`Delete Payment Error: ${error.message}`, 500));
    }
}));
exports.getNotificationPaymentByAdmin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payments = yield (0, payment_service_1.getNotificationPaymentByAdminService)();
        res.status(200).json({
            success: true,
            message: "Notification payment fetched successfully",
            payments,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(`Get Notification Payment Error: ${error.message}`, 500));
    }
}));
