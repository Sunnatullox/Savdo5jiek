import { Router } from "express";
import * as adminstratorController from "../controllers/adminstrator.controller";
import {
  isAdministrator,
  isAuthenticatedAdminstrator,
} from "../middleware/auth";
import { Role } from "../types/adminstrator.type";


const router = Router();

router.post("/adminstrator-otp", adminstratorController.adminstratorOTP);
router.post(
  "/adminstrator-otp-verify",
  adminstratorController.adminstratorOTPVerify
);
router.post("/adminstrator-login", adminstratorController.adminstratorLogin);
router.post(
  "/adminstrator-add-update-info",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  adminstratorController.adminstratorAddAndUpdateInfo
);

router.post(
  "/adminstrator-two-factor-auth-update-and-create",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  adminstratorController.adminstratorTwoFactorAuthUpdateAndCreate
);

router.get("/get-me-adminstrator", isAuthenticatedAdminstrator, adminstratorController.getAdminstratorInfo);




export default router;
