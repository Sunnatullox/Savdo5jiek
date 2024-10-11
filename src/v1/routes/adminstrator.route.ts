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

router.get(
  "/get-me-adminstrator",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  adminstratorController.getAdminstratorInfo
);

router.delete(
  "/delete-admin-device/:device_id",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  adminstratorController.deleteAdminDevice
);

router.delete(
  "/delete-admin-profile",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  adminstratorController.deleteAdminProfile
);

router.get(
  "/get-all-tax-agents",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  adminstratorController.getAllTaxAgents
);

router.get(
  "/get-tax-agent-by-id/:id",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  adminstratorController.getTaxAgentById
);

router.put(
  "/update-tax-agent/:id",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  adminstratorController.updateTaxAgent
);

router.delete(
  "/delete-tax-agent/:id",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  adminstratorController.deleteTaxAgent
);


export default router;
