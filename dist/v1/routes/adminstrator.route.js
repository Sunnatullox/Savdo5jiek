"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminstratorController = __importStar(require("../controllers/adminstrator.controller"));
const auth_1 = require("../middleware/auth");
const adminstrator_type_1 = require("../types/adminstrator.type");
const router = (0, express_1.Router)();
router.post("/adminstrator-otp", adminstratorController.adminstratorOTP);
router.post("/adminstrator-otp-verify", adminstratorController.adminstratorOTPVerify);
router.post("/adminstrator-login", adminstratorController.adminstratorLogin);
router.put("/adminstrator-update", auth_1.isAuthenticatedAdminstrator, (0, auth_1.isAdministrator)(adminstrator_type_1.Role.ADMIN), adminstratorController.adminstratorUpdate);
router.post("/adminstrator-add-update-info", auth_1.isAuthenticatedAdminstrator, (0, auth_1.isAdministrator)(adminstrator_type_1.Role.ADMIN), adminstratorController.adminstratorAddAndUpdateInfo);
router.post("/adminstrator-two-factor-auth-update-and-create", auth_1.isAuthenticatedAdminstrator, (0, auth_1.isAdministrator)(adminstrator_type_1.Role.ADMIN), adminstratorController.adminstratorTwoFactorAuthUpdateAndCreate);
router.get("/get-me-adminstrator", auth_1.isAuthenticatedAdminstrator, (0, auth_1.isAdministrator)(adminstrator_type_1.Role.ADMIN, adminstrator_type_1.Role.TAX_AGENT), adminstratorController.getAdminstratorInfo);
router.delete("/delete-admin-device/:device_id", auth_1.isAuthenticatedAdminstrator, (0, auth_1.isAdministrator)(adminstrator_type_1.Role.ADMIN), adminstratorController.deleteAdminDevice);
router.delete("/delete-admin-profile", auth_1.isAuthenticatedAdminstrator, (0, auth_1.isAdministrator)(adminstrator_type_1.Role.ADMIN), adminstratorController.deleteAdminProfile);
router.get("/get-all-tax-agents", auth_1.isAuthenticatedAdminstrator, (0, auth_1.isAdministrator)(adminstrator_type_1.Role.ADMIN), adminstratorController.getAllTaxAgents);
router.get("/get-tax-agent-by-id/:id", auth_1.isAuthenticatedAdminstrator, (0, auth_1.isAdministrator)(adminstrator_type_1.Role.ADMIN), adminstratorController.getTaxAgentById);
router.put("/update-tax-agent/:id", auth_1.isAuthenticatedAdminstrator, (0, auth_1.isAdministrator)(adminstrator_type_1.Role.ADMIN), adminstratorController.updateTaxAgent);
router.delete("/delete-tax-agent/:id", auth_1.isAuthenticatedAdminstrator, (0, auth_1.isAdministrator)(adminstrator_type_1.Role.ADMIN), adminstratorController.deleteTaxAgent);
router.get("/get-contracts-by-approved", auth_1.isAuthenticatedAdminstrator, (0, auth_1.isAdministrator)(adminstrator_type_1.Role.ADMIN, adminstrator_type_1.Role.TAX_AGENT), adminstratorController.getContractsByApproved);
exports.default = router;
