import { Router } from "express";
import { paymentImgUpload } from "../utils/fileUpload";
import {
  createPaymentUser,
  deletePaymentByAdmin,
  deletePaymentByUser,
  getPaymentById,
  getPaymentByAdmin,
  getPaymentsByContractId,
  updatePaymentByAdmin,
  updatePaymentByUser,
  updatePaymentStatus,
  getPaymentsByContractIdAdmin,
  getNotificationPaymentByAdmin,
  getPaymentsByAdmin,
  getPaymentsByUser,
} from "../controllers/payment.controller";
import {
  isAdministrator,
  isAuthenticatedAdminstrator,
  isAuthenticatedUser,
} from "../middleware/auth";
import { Role } from "../types/adminstrator.type";

const router = Router();

router.post(
  "/create-payment/:id",
  isAuthenticatedUser,
  paymentImgUpload.single("receiptImage"),
  createPaymentUser
);

router.get("/get-payments-by-user", isAuthenticatedUser, getPaymentsByUser);

router.get("/get-payment-by-user/:id", isAuthenticatedUser, getPaymentById);

router.get(
  "/get-payments-by-contract-id-admin/:id",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  getPaymentsByContractId
);

router.get(
  "/get-payment-by-admin/:id",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  getPaymentByAdmin
);

router.get(
  "/get-payments-by-admin",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  getPaymentsByAdmin
);

router.get(
  "/get-contractid-by-payment-admin/:id",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  getPaymentsByContractIdAdmin
);

router.get(
  "/get-notifications-by-payment-admin",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  getNotificationPaymentByAdmin
);

router.put(
  "/update-payment-by-user/:id",
  isAuthenticatedUser,
  paymentImgUpload.single("receiptImage"),
  updatePaymentByUser
);

router.put(
  "/update-payment-by-admin/:id",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  updatePaymentByAdmin
);

router.put(
  "/update-payment-status/:id",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  updatePaymentStatus
);

router.delete(
  "/delete-payment-by-user/:id",
  isAuthenticatedUser,
  deletePaymentByUser
);

router.delete(
  "/delete-payment-by-admin/:id",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  deletePaymentByAdmin
);

export default router;
