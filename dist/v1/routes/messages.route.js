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
const auth_1 = require("../middleware/auth");
const messagesController = __importStar(require("../controllers/messages.controller"));
const adminstrator_type_1 = require("../types/adminstrator.type");
const router = (0, express_1.Router)();
router.post("/send-message-user", auth_1.isAuthenticatedUser, messagesController.sendMessageUser);
router.post("/send-message-admin", auth_1.isAuthenticatedAdminstrator, (0, auth_1.isAdministrator)(adminstrator_type_1.Role.ADMIN), messagesController.sendMessageAdmin);
router.get("/get-messages-user/:contractId", auth_1.isAuthenticatedUser, messagesController.getMessagesUserByContractId);
router.get("/get-messages-admin/:contractId", auth_1.isAuthenticatedAdminstrator, (0, auth_1.isAdministrator)(adminstrator_type_1.Role.ADMIN), messagesController.getMessagesAdminByContractId);
router.get("/get-notification-user", auth_1.isAuthenticatedUser, messagesController.getNotificationUser);
router.get("/get-notification-admin", auth_1.isAuthenticatedAdminstrator, (0, auth_1.isAdministrator)(adminstrator_type_1.Role.ADMIN), messagesController.getNotificationAdmin);
exports.default = router;
