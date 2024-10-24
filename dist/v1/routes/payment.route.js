"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fileUpload_1 = require("../utils/fileUpload");
const payment_controller_1 = require("../controllers/payment.controller");
const auth_1 = require("../middleware/auth");
const adminstrator_type_1 = require("../types/adminstrator.type");
const router = (0, express_1.Router)();
router.post("/create-payment/:id", auth_1.isAuthenticatedUser, fileUpload_1.paymentImgUpload.single("receiptImage"), payment_controller_1.createPaymentUser);
router.get("/get-payments-by-user", auth_1.isAuthenticatedUser, payment_controller_1.getPaymentsByUser);
router.get("/get-payment-by-user/:id", auth_1.isAuthenticatedUser, payment_controller_1.getPaymentById);
router.get("/get-payments-by-contract-id-admin/:id", auth_1.isAuthenticatedAdminstrator, (0, auth_1.isAdministrator)(adminstrator_type_1.Role.ADMIN), payment_controller_1.getPaymentsByContractId);
router.get("/get-payment-by-admin/:id", auth_1.isAuthenticatedAdminstrator, (0, auth_1.isAdministrator)(adminstrator_type_1.Role.ADMIN), payment_controller_1.getPaymentByAdmin);
router.get("/get-payments-by-admin", auth_1.isAuthenticatedAdminstrator, (0, auth_1.isAdministrator)(adminstrator_type_1.Role.ADMIN), payment_controller_1.getPaymentsByAdmin);
router.get("/get-contractid-by-payment-admin/:id", auth_1.isAuthenticatedAdminstrator, (0, auth_1.isAdministrator)(adminstrator_type_1.Role.ADMIN), payment_controller_1.getPaymentsByContractIdAdmin);
router.get("/get-notifications-by-payment-admin", auth_1.isAuthenticatedAdminstrator, (0, auth_1.isAdministrator)(adminstrator_type_1.Role.ADMIN), payment_controller_1.getNotificationPaymentByAdmin);
router.put("/update-payment-by-user/:id", auth_1.isAuthenticatedUser, fileUpload_1.paymentImgUpload.single("receiptImage"), payment_controller_1.updatePaymentByUser);
router.put("/update-payment-by-admin/:id", auth_1.isAuthenticatedAdminstrator, (0, auth_1.isAdministrator)(adminstrator_type_1.Role.ADMIN), payment_controller_1.updatePaymentByAdmin);
router.put("/update-payment-status/:id", auth_1.isAuthenticatedAdminstrator, (0, auth_1.isAdministrator)(adminstrator_type_1.Role.ADMIN), payment_controller_1.updatePaymentStatus);
router.delete("/delete-payment-by-user/:id", auth_1.isAuthenticatedUser, payment_controller_1.deletePaymentByUser);
router.delete("/delete-payment-by-admin/:id", auth_1.isAuthenticatedAdminstrator, (0, auth_1.isAdministrator)(adminstrator_type_1.Role.ADMIN), payment_controller_1.deletePaymentByAdmin);
exports.default = router;
