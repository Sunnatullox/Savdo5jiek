import { Router } from "express";
import {
  isAdministrator,
  isAuthenticatedAdminstrator,
} from "../middleware/auth";
import { Role } from "../types/adminstrator.type";
import * as analyticsController from "../controllers/analytic.controller";
const router = Router();

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
  "/get-user-analytics",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  analyticsController.getUserAnalytics
);

router.get(
  "/get-low-stock-products",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  analyticsController.getLowStockProducts
);

export default router;