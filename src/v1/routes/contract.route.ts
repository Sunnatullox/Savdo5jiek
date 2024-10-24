import { Router } from "express";
import * as contractController from "../controllers/contract.controller";
import {
  isAdministrator,
  isAuthenticatedAdminstrator,
  isAuthenticatedUser,
} from "../middleware/auth";
import { Role } from "../types/adminstrator.type";
import { docUpload } from "../utils/fileUpload";

const router = Router();

router.post(
  "/create-contract-by-user",
  isAuthenticatedUser,
  contractController.createContractByUser
);

router.get(
  "/get-contracts-list-by-user",
  isAuthenticatedUser,
  contractController.getContractsListByUser
);

router.get(
  "/get-contract-by-user/:id",
  isAuthenticatedUser,
  contractController.getContractById
);

router.get(
  "/get-contracts-by-admin",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  contractController.getContractsByAdmin
);

router.get(
  "/get-contract-by-admin/:id",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  contractController.getContractByAdmin
);

router.put(
  "/update-contract-status-by-admin/:id",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  contractController.updateContractByAdminStatus
);

router.post(
  "/upload-contract-delivery-doc/:id",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  docUpload.single("contract_delivery_doc"),
  contractController.uploadContractDeliveryDoc
);

router.delete(
  "/delete-contract-by-admin/:id",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  contractController.deleteContractByAdmin
);

router.get(
  "/get-new-notifications-contract-by-admin",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  contractController.newNotificationsContractisAdmin
);

router.get(
  "/get-contracts-by-tax-agent",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.TAX_AGENT),
  contractController.getContractsByTaxAgent
);



export default router;
