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
const usercontroller = __importStar(require("../controllers/user.controller"));
const auth_1 = require("../middleware/auth");
const adminstrator_type_1 = require("../types/adminstrator.type");
const router = (0, express_1.Router)();
router.post("/login", usercontroller.login);
router.get("/logout", usercontroller.logout);
router.get("/get-me-user", auth_1.isAuthenticatedUser, usercontroller.getUser);
router.get("/get-user-id-by-admin/:id", auth_1.isAuthenticatedAdminstrator, (0, auth_1.isAdministrator)(adminstrator_type_1.Role.ADMIN), usercontroller.getUserByIdByAdmin);
router.patch("/update-user-data", auth_1.isAuthenticatedUser, usercontroller.updateUserData);
router.get("/get-all-users-by-admin", auth_1.isAuthenticatedAdminstrator, (0, auth_1.isAdministrator)(adminstrator_type_1.Role.ADMIN), usercontroller.getAllUsersByAdmin);
router.delete("/delete-user-by-admin/:id", auth_1.isAuthenticatedAdminstrator, (0, auth_1.isAdministrator)(adminstrator_type_1.Role.ADMIN), usercontroller.deleteUserByAdmin);
exports.default = router;
