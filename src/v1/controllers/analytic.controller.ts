import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../middleware/ErrorHandler";

import {
  get12MonthContractAnalyticsService,
  get12MonthPaymentAnalyticsService,
  get12MonthProductSalesAnalyticsService,
  get12MonthUserRegistrationAnalyticsService,
  getCategoryAnalyticsService,
  getContractsByApprovedService,
  getLowStockProductsService,
} from "../services/analytic.service";

export const get12MonthPaymentAnalytics = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const analytics = await get12MonthPaymentAnalyticsService();
      res.status(200).json({
        success: true,
        analytics,
      });
    } catch (error: any) {
      next(new ErrorHandler(`Please try again later: ${error.message}`, 500));
    }
  }
);

export const get12MonthUserRegistrationAnalytics = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const analytics = await get12MonthUserRegistrationAnalyticsService();
      res.status(200).json({
        success: true,
        analytics,
      });
    } catch (error: any) {
      next(new ErrorHandler(`Please try again later: ${error.message}`, 500));
    }
  }
);

export const get12MonthContractAnalytics = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const analytics = await get12MonthContractAnalyticsService();
      res.status(200).json({
        success: true,
        analytics,
      });
    } catch (error: any) {
      next(new ErrorHandler(`Please try again later: ${error.message}`, 500));
    }
  }
);

export const get12MonthProductSalesAnalytics = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const analytics = await get12MonthProductSalesAnalyticsService();
      res.status(200).json({
        success: true,
        analytics,
      });
    } catch (error: any) {
      next(new ErrorHandler(`Please try again later: ${error.message}`, 500));
    }
  }
);

export const getCategoryAnalytics = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const analytics = await getCategoryAnalyticsService();
      res.status(200).json({
        success: true,
        analytics,
      });
    } catch (error: any) {
      next(new ErrorHandler(`Please try again later: ${error.message}`, 500));
    }
  }
);

export const getLowStockProducts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await getLowStockProductsService();
      res.status(200).json({
        success: true,
        products,
      });
    } catch (error: any) {
      next(new ErrorHandler(`Please try again later: ${error.message}`, 500));
    }
  }
);

export const getContractsByApproved = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contracts = await getContractsByApprovedService();
      res.status(200).json({
        success: true,
        contracts,
      });
    } catch (error: any) {
      next(new ErrorHandler(`Please try again later: ${error.message}`, 500));
    }
  }
);
