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
exports.uploadContractDeliveryDoc = exports.getContractsByTaxAgent = exports.getContractById = exports.newNotificationsContractisAdmin = exports.deleteContractByAdmin = exports.updateContractByAdminStatus = exports.getContractByAdmin = exports.getContractsByAdmin = exports.getContractsListByUser = exports.createContractByUser = void 0;
const fs_1 = __importDefault(require("fs"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ErrorHandler_1 = __importDefault(require("../middleware/ErrorHandler"));
const contract_service_1 = require("../services/contract.service");
const db_1 = __importDefault(require("../config/db"));
const uniqid_1 = __importDefault(require("uniqid"));
const fileReplace_1 = require("../utils/fileReplace");
const uz_fq_1 = __importDefault(require("../data/contracts/uz/uz_fq"));
const uz_tsh_1 = __importDefault(require("../data/contracts/uz/uz_tsh"));
const numberToWords_1 = require("../utils/numberToWords");
const ru_fq_1 = __importDefault(require("../data/contracts/ru/ru_fq"));
const ru_tsh_1 = __importDefault(require("../data/contracts/ru/ru_tsh"));
const fileUpload_1 = require("../utils/fileUpload");
const payment_service_1 = require("../services/payment.service");
const messages_service_1 = require("../services/messages.service");
exports.createContractByUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return next(new ErrorHandler_1.default("Please login to create a contract", 401));
        }
        const { id } = req.user;
        const { products, totalPrice, isDelivery } = req.body;
        if (!products.length || !totalPrice) {
            return next(new ErrorHandler_1.default("All fields are required", 400));
        }
        const findsProducts = yield db_1.default.product.findMany({
            where: { id: { in: products.map((product) => product.id) } },
            include: { category: true },
            orderBy: {
                createdAt: 'asc',
            },
        });
        // Check if requested quantity exceeds available stock
        const productsWithQty = products
            .map((product) => {
            const foundProduct = findsProducts.find((p) => p.id === product.id);
            if (foundProduct) {
                if (product.qty > foundProduct.stock) {
                    return next(new ErrorHandler_1.default(`Requested quantity for product ${foundProduct.name_uz} exceeds available stock`, 400));
                }
                return Object.assign(Object.assign({}, foundProduct), { qty: product.qty });
            }
        })
            .filter(Boolean);
        if (findsProducts.length !== products.length) {
            return next(new ErrorHandler_1.default("Please select the correct products", 404));
        }
        const findAdmin = (yield db_1.default.administration.findFirst({
            where: { role: "ADMIN", AdminInfo: { isNot: null } },
            include: { AdminInfo: true },
            orderBy: { createdAt: "asc" },
        }));
        if (!findAdmin) {
            return next(new ErrorHandler_1.default("Admin not found", 404));
        }
        const findUser = (yield db_1.default.user.findFirst({
            where: { id },
            include: { legal_info: true },
        }));
        if (!findUser) {
            return next(new ErrorHandler_1.default("User not found", 404));
        }
        const contract_id = uniqid_1.default.time() + "-uz";
        const now = new Date();
        const formattedDate = now
            .toLocaleDateString("en-GB")
            .split("/")
            .join(".");
        const deliveryDate = new Date(now.setMonth(now.getMonth() + 1));
        const formattedDeliveryDate = deliveryDate
            .toLocaleDateString("en-GB")
            .split("/")
            .join(".");
        const contractEndDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
        const formattedContractEndDate = contractEndDate
            .toLocaleDateString("en-GB")
            .split("/")
            .join(".");
        const writtenTotalPriceRu = (0, numberToWords_1.numberToWordsRu)(totalPrice);
        const writtenTotalPriceUz = (0, numberToWords_1.numberToWordsUz)(Number(totalPrice));
        const fileNameUz = `document-${Date.now()}-uz.pdf`;
        const fileNameRu = `document-${Date.now()}-ru.pdf`;
        const qrCodeFileUz = yield (0, fileUpload_1.qrCodeGenerator)(`${req.protocol}://${req.get("host")}/public/contracts/uz/${fileNameUz}`);
        const qrCodeFileRu = yield (0, fileUpload_1.qrCodeGenerator)(`${req.protocol}://${req.get("host")}/public/contracts/ru/${fileNameRu}`);
        const contractFile = {
            contractFileUz: !findUser.is_LLC
                ? `${req.protocol}://${req.get("host")}/public` +
                    (yield (0, fileReplace_1.htmlToPDFAndSave)(yield (0, uz_fq_1.default)(findAdmin, findUser, productsWithQty, isDelivery, {
                        contractId: contract_id,
                        contractDate: formattedDate,
                        productsCategoryUz: findsProducts
                            .map((p) => p.category.name_uz)
                            .join(", "),
                        totalPrice,
                        deliveryDate: formattedDeliveryDate,
                        writtenTotalPriceUz,
                        contractEndDate: formattedContractEndDate,
                        qrcode: qrCodeFileUz,
                    }), "uz", fileNameUz))
                : `${req.protocol}://${req.get("host")}/public` +
                    (yield (0, fileReplace_1.htmlToPDFAndSave)(yield (0, uz_tsh_1.default)(findAdmin, findUser, productsWithQty, isDelivery, {
                        contractId: contract_id,
                        contractDate: formattedDate,
                        productsCategoryUz: findsProducts
                            .map((p) => p.category.name_uz)
                            .join(", "),
                        totalPrice,
                        deliveryDate: formattedDeliveryDate,
                        writtenTotalPriceUz,
                        contractEndDate: formattedContractEndDate,
                        qrcode: qrCodeFileUz,
                    }), "uz", fileNameUz)),
            contractFileRu: !findUser.is_LLC
                ? `${req.protocol}://${req.get("host")}/public` +
                    (yield (0, fileReplace_1.htmlToPDFAndSave)(yield (0, ru_fq_1.default)(findAdmin, findUser, productsWithQty, isDelivery, {
                        contractId: contract_id,
                        contractDate: formattedDate,
                        productsCategoryRu: findsProducts
                            .map((p) => p.category.name_ru)
                            .join(", "),
                        totalPrice,
                        deliveryDate: formattedDeliveryDate,
                        writtenTotalPriceRu,
                        contractEndDate: formattedContractEndDate,
                        qrcode: qrCodeFileRu,
                    }), "ru", fileNameRu))
                : `${req.protocol}://${req.get("host")}/public` +
                    (yield (0, fileReplace_1.htmlToPDFAndSave)(yield (0, ru_tsh_1.default)(findAdmin, findUser, productsWithQty, isDelivery, {
                        contractId: contract_id,
                        contractDate: formattedDate,
                        productsCategoryRu: findsProducts
                            .map((p) => p.category.name_ru)
                            .join(", "),
                        totalPrice,
                        deliveryDate: formattedDeliveryDate,
                        writtenTotalPriceRu,
                        contractEndDate: formattedContractEndDate,
                        qrcode: qrCodeFileRu,
                    }), "ru", fileNameRu)),
        };
        const newContract = yield (0, contract_service_1.createContractService)({
            contract_id,
            User: { connect: { id } },
            products: productsWithQty,
            totalPrice,
            contractFile: contractFile,
            deliveryFile: "",
            shippingAddress: findUser.is_LLC
                ? findUser.legal_info.address
                : findUser.address,
            isDelivery,
            paymentEndDate: yield (0, contract_service_1.addBusinessDays)(new Date(), 7),
            contractEndDate: formattedContractEndDate,
            deliveryDate: formattedDeliveryDate,
            is_LLC: findUser.is_LLC,
        });
        res.status(201).json({
            success: true,
            message: "Contract created successfully",
            newContract,
        });
    }
    catch (error) {
        console.log("Contract error", error);
        return next(new ErrorHandler_1.default(`Error creating contract: ${error.message}`, 500));
    }
}));
exports.getContractsListByUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, is_LLC } = req.user;
        const contract = yield (0, contract_service_1.getContractsByIdService)(id, is_LLC);
        res.status(200).json({
            success: true,
            message: "Contract list fetched successfully",
            contract,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(`Something went wrong: ${error.message}`, 500));
    }
}));
exports.getContractsByAdmin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contracts = yield (0, contract_service_1.getContractsByAdminService)();
        res.status(200).json({
            success: true,
            message: "Contracts fetched successfully",
            contracts,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(`Error getting contracts: ${error.message}`, 500));
    }
}));
exports.getContractByAdmin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const contract = yield (0, contract_service_1.getContractByIdService)(id);
        if (!contract) {
            return next(new ErrorHandler_1.default("Contract not found", 404));
        }
        res.status(200).json({
            success: true,
            message: "Contract fetched successfully",
            contract,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(`Error getting contract: ${error.message}`, 500));
    }
}));
exports.updateContractByAdminStatus = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status) {
            return next(new ErrorHandler_1.default("Status is required", 400));
        }
        const findContract = (yield (0, contract_service_1.getContractByIdService)(id));
        if (!findContract) {
            return next(new ErrorHandler_1.default("Contract not found", 404));
        }
        if (findContract.status === status) {
            return next(new ErrorHandler_1.default("Contract status is already updated", 400));
        }
        const contract = yield (0, contract_service_1.updateContractService)(id, { status });
        res.status(200).json({
            success: true,
            message: "Contract status updated successfully",
            contract,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(`Error updating contract status: ${error.message}`, 500));
    }
}));
exports.deleteContractByAdmin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Contract ID
    try {
        // Transaction start
        yield db_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const contract = yield prisma.contract.findUnique({
                where: { id },
                include: {
                    Payment: true,
                    Message: true,
                },
            });
            if (!contract) {
                throw new ErrorHandler_1.default("Contract not found", 404);
            }
            // Check if any payment is approved
            const approvedPaymentExists = contract.Payment.some((payment) => payment.status === "approved");
            if (approvedPaymentExists) {
                throw new ErrorHandler_1.default("Contract payment is approved", 400);
            }
            // Delete payments
            for (const payment of contract.Payment) {
                yield deleteFile(payment.receiptImage);
                yield (0, payment_service_1.deletePayment)(payment.id);
            }
            // Delete messages
            for (const message of contract.Message) {
                yield (0, messages_service_1.deleteMessageAdminService)(message.id);
            }
            // Delete contract files
            function deleteFile(fileUrl) {
                return __awaiter(this, void 0, void 0, function* () {
                    const url = new URL(fileUrl);
                    const filePath = `.${url.pathname}`;
                    if (fs_1.default.existsSync(filePath)) {
                        yield fs_1.default.promises.unlink(filePath).catch((err) => {
                            throw err;
                        });
                    }
                });
            }
            ;
            const contractFile = contract.contractFile;
            if (contractFile) {
                if (contractFile.contractFileUz) {
                    yield deleteFile(contractFile.contractFileUz);
                }
                if (contractFile.contractFileRu) {
                    yield deleteFile(contractFile.contractFileRu);
                }
            }
            // Finally, delete the contract
            yield prisma.contract.delete({
                where: { id },
            });
        }));
        res.status(200).json({
            success: true,
            message: "Contract deleted successfully",
        });
    }
    catch (error) {
        console.log("Error deleting contract", error);
        next(new ErrorHandler_1.default(`Error deleting contract: ${error.message}`, 500));
    }
}));
exports.newNotificationsContractisAdmin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contracts = (yield (0, contract_service_1.newNotifsContractisAdmin)());
        res.status(200).json({
            success: true,
            message: "Notifications fetched successfully",
            contracts,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(`Error creating notification: ${error.message}`, 500));
    }
}));
exports.getContractById = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!req.user) {
            return next(new ErrorHandler_1.default("Please login to get a contract", 401));
        }
        const contract = (yield (0, contract_service_1.getContractByIdService)(id, req.user.id));
        if (!contract) {
            return next(new ErrorHandler_1.default("Contract not found", 404));
        }
        if (!contract.isRead) {
            yield (0, contract_service_1.updateContractService)(id, { isRead: true });
        }
        res.status(200).json({
            success: true,
            message: "Contract fetched successfully",
            contract,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(`Error getting contract: ${error.message}`, 500));
    }
}));
exports.getContractsByTaxAgent = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contracts = yield (0, contract_service_1.getContractByTaxAgentService)({
            where: { status: "approved" },
            orderBy: {
                createdAt: 'asc',
            },
        });
        res.status(200).json({
            success: true,
            message: "Contracts fetched successfully",
            contracts,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(`Error getting contracts: ${error.message}`, 500));
    }
}));
exports.uploadContractDeliveryDoc = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const contract_delivery_doc = req.file;
        const findContract = yield (0, contract_service_1.getContractByIdService)(id);
        if (!findContract) {
            return next(new ErrorHandler_1.default("Contract not found", 404));
        }
        const contract_delivery_doc_path = `${req.protocol}://${req.get("host")}/public/contracts/contract_delivery_doc/${contract_delivery_doc.filename}`;
        if (findContract.deliveryFile) {
            const url = new URL(findContract.deliveryFile);
            const filePath = `.${url.pathname}`;
            if (fs_1.default.existsSync(filePath)) {
                yield fs_1.default.promises.unlink(filePath).catch((err) => {
                    throw err;
                });
            }
        }
        const contract = yield (0, contract_service_1.updateContractService)(id, {
            deliveryFile: contract_delivery_doc_path,
        });
        res.status(200).json({
            success: true,
            message: "Contract delivery document uploaded successfully",
            contract,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(`Error uploading contract delivery document: ${error.message}`, 500));
    }
}));
