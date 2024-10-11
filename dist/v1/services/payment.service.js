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
exports.createPayment = createPayment;
exports.getPaymentByIdService = getPaymentByIdService;
exports.getPaymentsByUserService = getPaymentsByUserService;
exports.getPaymentsByUserIdService = getPaymentsByUserIdService;
exports.getPaymentsByAdminService = getPaymentsByAdminService;
exports.getPaymentsByContractIdAdminService = getPaymentsByContractIdAdminService;
exports.getNotificationPaymentByAdminService = getNotificationPaymentByAdminService;
exports.updatePayment = updatePayment;
exports.deletePayment = deletePayment;
exports.updatePaymentAndContractStatus = updatePaymentAndContractStatus;
const db_1 = __importDefault(require("../config/db"));
const product_service_1 = require("./product.service");
const contract_service_1 = require("./contract.service");
function createPayment(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.payment.create({
            data,
        });
    });
}
function getPaymentByIdService(id, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.payment.findFirst({
            where: userId ? { id, userId } : { id },
        });
    });
}
function getPaymentsByUserService(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.payment.findMany({
            where: { userId },
            include: {
                contract: true,
            },
        });
    });
}
function getPaymentsByUserIdService(contractId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.payment.findMany({
            where: { contractId, userId },
            orderBy: {
                createdAt: 'asc',
            },
        });
    });
}
function getPaymentsByAdminService() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.payment.findMany({
            include: {
                contract: {
                    select: {
                        id: true,
                        contract_id: true,
                        totalPrice: true,
                        paidAmount: true,
                        paidPercent: true,
                        status: true,
                    },
                },
                user: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
    });
}
function getPaymentsByContractIdAdminService(contractId) {
    return __awaiter(this, void 0, void 0, function* () {
        const contract = yield db_1.default.payment.findMany({
            where: { contractId },
            include: {
                contract: true,
                user: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
        yield db_1.default.payment.updateMany({
            where: { contractId },
            data: { isRead: true },
        });
        return contract;
    });
}
function getNotificationPaymentByAdminService() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.payment.findMany({
            where: { isRead: false },
            orderBy: {
                createdAt: 'asc',
            },
        });
    });
}
function updatePayment(id, data, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.payment.update({
            where: userId ? { id, userId } : { id },
            data,
        });
    });
}
function deletePayment(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.payment.delete({
            where: { id },
        });
    });
}
function updatePaymentAndContractStatus(paymentId, status) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
            const payment = yield tx.payment.findUnique({
                where: { id: paymentId },
                include: { contract: true },
            });
            if (!payment) {
                throw new Error("Payment not found");
            }
            if (!payment.contract) {
                throw new Error("Contract associated with the payment not found");
            }
            let updatedPaidAmount = payment.contract.paidAmount;
            let paidPercent = (updatedPaidAmount / payment.contract.totalPrice) * 100;
            let productsInContract;
            try {
                productsInContract =
                    typeof payment.contract.products === "string"
                        ? JSON.parse(payment.contract.products)
                        : payment.contract.products;
            }
            catch (error) {
                throw new Error("Invalid product data format in contract");
            }
            if (status === "approved") {
                updatedPaidAmount += payment.amount;
                paidPercent = (updatedPaidAmount / payment.contract.totalPrice) * 100;
                // Check if the contract's previous paidPercent was less than 30
                const wasPreviouslyBelowThreshold = payment.contract.paidPercent < 30;
                if (paidPercent > 29.99 && wasPreviouslyBelowThreshold) {
                    for (const product of productsInContract) {
                        const existingProduct = yield (0, product_service_1.getProductByIdService)(product.id);
                        if (existingProduct) {
                            try {
                                yield (0, product_service_1.updateProductService)(tx, product.id, {
                                    stock: existingProduct.stock - product.qty,
                                });
                            }
                            catch (error) {
                                throw new Error(`Failed to update stock for product ${product.id}`);
                            }
                        }
                    }
                }
                yield (0, contract_service_1.updateContractService)(payment.contractId, {
                    paidAmount: Number(updatedPaidAmount.toFixed(2)),
                    paidPercent: Number(paidPercent.toFixed(2)),
                    status: paidPercent > 29.99 ? "approved" : payment.contract.status,
                });
            }
            else if (status === "rejected" && payment.status === "approved") {
                updatedPaidAmount -= payment.amount;
                paidPercent = (updatedPaidAmount / payment.contract.totalPrice) * 100;
                if (paidPercent < 30) {
                    for (const product of productsInContract) {
                        const existingProduct = yield (0, product_service_1.getProductByIdService)(product.id);
                        if (existingProduct) {
                            try {
                                yield (0, product_service_1.updateProductService)(tx, product.id, {
                                    stock: existingProduct.stock + product.qty,
                                });
                            }
                            catch (error) {
                                throw new Error(`Failed to update stock for product ${product.id}`);
                            }
                        }
                    }
                }
                yield (0, contract_service_1.updateContractService)(payment.contractId, {
                    paidAmount: Number(updatedPaidAmount.toFixed(2)),
                    paidPercent: Number(paidPercent.toFixed(2)),
                    status: paidPercent < 30 ? "rejected" : payment.contract.status,
                });
            }
            return yield tx.payment.update({
                where: { id: paymentId },
                data: { status: status },
            });
        }), {
            timeout: 10000 // 10 seconds
        });
    });
}
