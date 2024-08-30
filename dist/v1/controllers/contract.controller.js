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
exports.getContractsByTaxAgent = exports.getContractById = exports.newNotificationsContractisAdmin = exports.deleteContractByAdmin = exports.updateContratcByAdminStatus = exports.getContractByAdmin = exports.getContractsByAdmin = exports.getContractsByIdUser = exports.createContractByUser = void 0;
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
exports.createContractByUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return next(new ErrorHandler_1.default("Please login to create a contract", 401));
        }
        const { id } = req.user;
        const { products, totalPrice, isDelivery, } = req.body;
        if (products.length === 0 || !totalPrice) {
            return next(new ErrorHandler_1.default("All fields are required", 400));
        }
        const findsProducts = yield db_1.default.product.findMany({
            where: {
                id: { in: products.map((product) => product.id) },
            },
            include: {
                category: true,
            },
        });
        const productsWithQty = [];
        for (const product of products) {
            const foundProduct = findsProducts.find((p) => p.id === product.id);
            if (foundProduct) {
                productsWithQty.push(Object.assign(Object.assign({}, foundProduct), { qty: product.qty }));
            }
        }
        if (findsProducts.length !== products.length) {
            return next(new ErrorHandler_1.default("Please select the correct products", 404));
        }
        const findAdmin = yield db_1.default.administration.findFirst({
            where: {
                role: "ADMIN",
            },
            include: {
                AdminInfo: true,
            },
        });
        if (!findAdmin) {
            return next(new ErrorHandler_1.default("Admin not found", 404));
        }
        const findUser = yield db_1.default.user.findFirst({
            where: {
                id,
            },
            include: {
                legal_info: true,
            },
        });
        if (!findUser) {
            return next(new ErrorHandler_1.default("User not found", 404));
        }
        if (productsWithQty.length === 0) {
            return next(new ErrorHandler_1.default("Please select the correct products", 404));
        }
        const contract_id = (0, uniqid_1.default)("", "UZ");
        // now date
        const now = new Date();
        const day = String(now.getDate()).padStart(2, "0");
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const year = now.getFullYear();
        const formattedDate = `${day}.${month}.${year}`;
        const productsCategoryUz = yield Promise.all(findsProducts.map((product) => __awaiter(void 0, void 0, void 0, function* () { return yield product.category.name_uz; })));
        const productsCategoryRu = yield Promise.all(findsProducts.map((product) => __awaiter(void 0, void 0, void 0, function* () { return yield product.category.name_ru; })));
        // delivery date
        const deliveryDate = new Date(new Date().setMonth(now.getMonth() + 1));
        const deliveryDay = String(deliveryDate.getDate()).padStart(2, "0");
        const deliveryMonth = String(deliveryDate.getMonth() + 1).padStart(2, "0");
        const deliveryYear = deliveryDate.getFullYear();
        const formattedDeliveryDate = `${deliveryDay}.${deliveryMonth}.${deliveryYear}`;
        const writtenTotalPriceRu = (0, numberToWords_1.numberToWordsRu)(totalPrice);
        const writtenTotalPriceUz = (0, numberToWords_1.numberToWordsUz)(Number(totalPrice));
        // contract end date
        const contractEndDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
        const contractEndDateDay = String(contractEndDate.getDate()).padStart(2, "0");
        const contractEndDateMonth = String(contractEndDate.getMonth() + 1).padStart(2, "0");
        const contractEndDateYear = contractEndDate.getFullYear();
        const formattedContractEndDate = `${contractEndDateDay}.${contractEndDateMonth}.${contractEndDateYear}`;
        const contractFile = {
            contractFileUz: !findUser.is_LLC
                ? `${req.protocol}://${req.get("host")}/public` +
                    (yield (0, fileReplace_1.htmlToPDFAndSave)(yield (0, uz_fq_1.default)(findAdmin, findUser, productsWithQty, isDelivery, {
                        contractId: contract_id,
                        contractDate: formattedDate,
                        productsCategoryUz: productsCategoryUz.join(", "),
                        totalPrice,
                        deliveryDate: formattedDeliveryDate,
                        writtenTotalPriceUz,
                        contractEndDate: formattedContractEndDate,
                    }), "uz"))
                : `${req.protocol}://${req.get("host")}/public` +
                    (yield (0, fileReplace_1.htmlToPDFAndSave)(yield (0, uz_tsh_1.default)(findAdmin, findUser, productsWithQty, isDelivery, {
                        contractId: contract_id,
                        contractDate: formattedDate,
                        productsCategoryUz: productsCategoryUz.join(", "),
                        totalPrice,
                        deliveryDate: formattedDeliveryDate,
                        writtenTotalPriceUz,
                        contractEndDate: formattedContractEndDate,
                    }), "uz")),
            contractFileRu: !findUser.is_LLC
                ? `${req.protocol}://${req.get("host")}/public` +
                    (yield (0, fileReplace_1.htmlToPDFAndSave)(yield (0, ru_fq_1.default)(findAdmin, findUser, productsWithQty, isDelivery, {
                        contractId: contract_id,
                        contractDate: formattedDate,
                        productsCategoryRu: productsCategoryRu.join(", "),
                        totalPrice,
                        deliveryDate: formattedDeliveryDate,
                        writtenTotalPriceRu,
                        contractEndDate: formattedContractEndDate,
                    }), "ru"))
                : `${req.protocol}://${req.get("host")}/public` +
                    (yield (0, fileReplace_1.htmlToPDFAndSave)(yield (0, ru_tsh_1.default)(findAdmin, findUser, productsWithQty, isDelivery, {
                        contractId: contract_id,
                        contractDate: formattedDate,
                        productsCategoryRu: productsCategoryRu.join(", "),
                        totalPrice,
                        deliveryDate: formattedDeliveryDate,
                        writtenTotalPriceRu,
                        contractEndDate: formattedContractEndDate,
                    }), "ru")),
        };
        const newContract = yield (0, contract_service_1.createContractService)({
            contract_id,
            User: { connect: { id } },
            products: productsWithQty,
            totalPrice: totalPrice,
            contractFile: contractFile,
            deliveryFile: "",
            shippingAddress: "",
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
exports.getContractsByIdUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return next(new ErrorHandler_1.default("Please login to get a contract", 401));
        }
        const { id } = req.user;
        const contract = yield (0, contract_service_1.getContractsByIdService)(id, req.user.is_LLC);
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
exports.updateContratcByAdminStatus = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    catch (error) { }
}));
exports.deleteContractByAdmin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const { id } = req.params;
        const findContract = (yield (0, contract_service_1.getContractByIdService)(id));
        if (!findContract) {
            return next(new ErrorHandler_1.default("Contract not found", 404));
        }
        const findContactPaymentStatusApproved = findContract.Payment.some((payment) => payment.status === "approved");
        if (findContactPaymentStatusApproved) {
            return next(new ErrorHandler_1.default("Contract payment is approved", 400));
        }
        const contract = (yield (0, contract_service_1.deleteContractService)(id));
        if ((_a = contract === null || contract === void 0 ? void 0 : contract.contractFile) === null || _a === void 0 ? void 0 : _a.contractFileUz) {
            const url_uz = new URL((_b = contract === null || contract === void 0 ? void 0 : contract.contractFile) === null || _b === void 0 ? void 0 : _b.contractFileUz);
            const filePath_uz = `.${url_uz.pathname}`;
            if (fs_1.default.existsSync(filePath_uz)) {
                fs_1.default.unlinkSync(filePath_uz);
            }
        }
        if ((_c = contract === null || contract === void 0 ? void 0 : contract.contractFile) === null || _c === void 0 ? void 0 : _c.contractFileRu) {
            const url_ru = new URL((_d = contract === null || contract === void 0 ? void 0 : contract.contractFile) === null || _d === void 0 ? void 0 : _d.contractFileRu);
            const filePath_ru = `.${url_ru.pathname}`;
            if (fs_1.default.existsSync(filePath_ru)) {
                fs_1.default.unlinkSync(filePath_ru);
            }
        }
        if ((_e = contract === null || contract === void 0 ? void 0 : contract.deliveryFile) === null || _e === void 0 ? void 0 : _e.deliveryFileUz) {
            const url_delivery = new URL(contract.deliveryFile.deliveryFileUz);
            const filePath_delivery = `.${url_delivery.pathname}`;
            if (fs_1.default.existsSync(filePath_delivery)) {
                fs_1.default.unlinkSync(filePath_delivery);
            }
        }
        if ((_f = contract === null || contract === void 0 ? void 0 : contract.deliveryFile) === null || _f === void 0 ? void 0 : _f.deliveryFileRu) {
            const url_delivery = new URL(contract.deliveryFile.deliveryFileRu);
            const filePath_delivery = `.${url_delivery.pathname}`;
            if (fs_1.default.existsSync(filePath_delivery)) {
                fs_1.default.unlinkSync(filePath_delivery);
            }
        }
        res.status(200).json({
            success: true,
            message: "Contract deleted successfully",
            contract,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(`Error deleting contract: ${error.message}`, 500));
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
    var _a;
    try {
        const { id } = req.params;
        if (!req.user) {
            return next(new ErrorHandler_1.default("Please login to get a contract", 401));
        }
        const contract = (yield (0, contract_service_1.getContractByIdService)(id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id));
        if (!contract) {
            return next(new ErrorHandler_1.default("Contract not found", 404));
        }
        if (contract.isRead === false) {
            yield (0, contract_service_1.updateContractService)(id, { isRead: true });
        }
        res.status(200).json({
            success: true,
            message: "Contract fetched successfully",
            contract,
        });
    }
    catch (error) { }
}));
exports.getContractsByTaxAgent = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contracts = yield (0, contract_service_1.getContractByTaxAgentService)({
            where: { status: "approved" },
        });
        res.status(200).json({
            success: true,
            message: "Contracts fetched successfully",
            contracts,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(`Error getting contract: ${error.message}`, 500));
    }
}));
