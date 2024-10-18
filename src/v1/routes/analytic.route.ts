import { Router } from "express";
import {
  isAdministrator,
  isAuthenticatedAdminstrator,
} from "../middleware/auth";
import { Role } from "../types/adminstrator.type";
import * as analyticsController from "../controllers/analytic.controller";
const router = Router();

router.get(
  "/get-12-month-payment-analytics",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  analyticsController.get12MonthPaymentAnalytics
);

router.get(
  "/get-12-month-user-registration-analytics",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  analyticsController.get12MonthUserRegistrationAnalytics
);

router.get(
  "/get-12-month-contract-analytics",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  analyticsController.get12MonthContractAnalytics
);

router.get(
  "/get-12-month-product-sales-analytics",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  analyticsController.get12MonthProductSalesAnalytics
);

router.get(
  "/get-category-analytics",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  analyticsController.getCategoryAnalytics
);

router.get(
  "/get-low-stock-products",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  analyticsController.getLowStockProducts
);

router.get(
  "/get-contracts-by-approved-analytics",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN,Role.TAX_AGENT),
  analyticsController.getContractsByApproved
);

export default router;
