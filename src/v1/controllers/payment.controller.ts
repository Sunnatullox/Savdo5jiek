import path from 'path';
import fs from 'fs';
import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import ErrorHandler from "../middleware/ErrorHandler";
import { Payment, User } from "@prisma/client";
import {
  createPayment,
  deletePayment,
  getNotificationPaymentByAdminService,
  getPaymentByIdService,
  getPaymentsByContractIdAdminService,
  getPaymentsByUserIdService,
  updatePayment,
} from "../services/payment.service";
import {
  getContractByIdService,
  updateContractService,
} from "../services/contract.service";
import {
  getProductByIdService,
  updateProductService,
} from "../services/product.service";

export const createPaymentUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { amount, paidDate } = req.body;
      const { user } = req as { user: User };
      const { file } = req as { file: Express.Multer.File };

      if (!user) {
        return next(new ErrorHandler("Please login to continue", 404));
      }

      if (!id || !amount || !file || !paidDate) {
        return next(new ErrorHandler("All fields are required", 400));
      }

      const imagePath = `${req.protocol}://${req.get("host")}/public/payments/${file.filename}`;

      const findContract = await getContractByIdService(id, user.id);
      if (!findContract) {
        return next(new ErrorHandler("Invalid contract ID or the contract doesn't belong to you", 404));
      }

      const payment = await createPayment({
        amount,
        paidDate,
        receiptImage: imagePath,
        user: { connect: { id: user.id } },
        contract: { connect: { id } },
      });

      res.status(201).json({
        success: true,
        message: "Payment created successfully",
        payment,
      });
    } catch (error: any) {
      next(new ErrorHandler(`Create Payment Error: ${error.message}`, 500));
    }
  }
);

export const getPaymentById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req as { user: User };
      const { id } = req.params;

      if (!user) {
        return next(new ErrorHandler("Please login to continue", 404));
      }

      if (!id) {
        return next(new ErrorHandler("Payment id is required", 400));
      }

      const payment = await getPaymentByIdService(id, user.id);

      if (!payment) {
        return next(new ErrorHandler("Payment not found", 404));
      }

      res.status(200).json({
        success: true,
        message: "Payment fetched successfully",
        payment,
      });
    } catch (error: any) {
      next(new ErrorHandler(`Get Payment Error: ${error.message}`, 500));
    }
  }
);

export const getPaymentsByContractId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { user } = req as { user: User };

      if (!user) {
        return next(new ErrorHandler("Please login to continue", 404));
      }

      if (!id) {
        return next(new ErrorHandler("Contract id is required", 400));
      }

      const payments = await getPaymentsByUserIdService(id, user.id) as Payment[];

      res.status(200).json({
        success: true,
        message: "Payments fetched successfully",
        payments,
      });
    } catch (error: any) {
      next(new ErrorHandler(`Get Payments Error: ${error.message}`, 500));
    }
  }
);

export const getPaymentByAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const payments = await getPaymentByIdService(id);
      if (!payments) {
        return next(new ErrorHandler("Payment not found", 404));
      }

      if(payments.isRead === false){
        await updatePayment(payments.id, { isRead: true });
      }

      res.status(200).json({
        success: true,
        message: "Payment fetched successfully",
        payments,
      });
    } catch (error: any) {
      next(new ErrorHandler(`Get Payments Error: ${error.message}`, 500));
    }
  }
);

export const getPaymentsByContractIdAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const payments = await getPaymentsByContractIdAdminService(id);

      res.status(200).json({
        success: true,
        message: "Payments fetched successfully",
        payments,
      });
    } catch (error: any) {
      next(new ErrorHandler(`Get Payments Error: ${error.message}`, 500));
    }
  }
)

export const updatePaymentByUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { amount, paidDate } = req.body;
      const { user } = req as { user: User };
      const { file } = req as { file: Express.Multer.File };

      if (!user) {
        return next(new ErrorHandler("Please login to continue", 404));
      }

      if (!amount || !paidDate) {
        return next(new ErrorHandler("All fields are required", 400));
      }

      const findPayment = await getPaymentByIdService(id, user.id);
      if (!findPayment) {
        return next(new ErrorHandler("Payment not found", 404));
      }

      if (findPayment.status === "approved") {
        return next(new ErrorHandler("Payment cannot be updated, it is approved", 400));
      }

      let updateData: any = { amount, paidDate };

      if (file) {
        const imagePath = `${req.protocol}://${req.get("host")}/public/payments/${file.filename}`;
        updateData.receiptImage = imagePath;

        if (findPayment.receiptImage) {
          const filename = findPayment.receiptImage.split('/public/payments/')[1];
          const filePath = path.join(__dirname, '../../../public/payments', filename);
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error("Failed to delete image file:", err);
            }
          });
        }
      }

      const payment = await updatePayment(id, updateData, user.id);

      if (!payment) {
        return next(new ErrorHandler("Sorry, payment not updated, please try again", 404));
      }

      res.status(200).json({
        success: true,
        message: "Payment updated successfully",
        payment,
      });
    } catch (error: any) {
      next(new ErrorHandler(`Update Payment Error: ${error.message}`, 500));
    }
  }
);

export const updatePaymentByAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { amount, paidDate } = req.body;

      if (!amount || !paidDate) {
        return next(new ErrorHandler("All fields are required", 400));
      }

      const payment = await updatePayment(id, { amount, paidDate });
      if (!payment) {
        return next(new ErrorHandler("Sorry, payment not updated, please try again", 404));
      }

      res.status(200).json({
        success: true,
        message: "Payment updated successfully",
        payment,
      });
    } catch (error: any) {
      next(new ErrorHandler(`Update Payment Error: ${error.message}`, 500));
    }
  }
);

export const updatePaymentStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params; // Payment ID
      const { status } = req.body;

      if (!status) {
        return next(new ErrorHandler("Status is required", 400));
      }

      const payment = await getPaymentByIdService(id);
      if (!payment) {
        return next(new ErrorHandler("Payment not found", 404));
      }

      const contract = await getContractByIdService(payment.contractId);
      if (!contract) {
        return next(new ErrorHandler("Contract not found", 404));
      }

      let updatedPaidAmount = contract.paidAmount;
      let paidPercent = (updatedPaidAmount / contract.totalPrice) * 100;

      if (status === "approved") {
        updatedPaidAmount += payment.amount;
        paidPercent = (updatedPaidAmount / contract.totalPrice) * 100;

        await updateContractService(payment.contractId, {
          paidAmount: updatedPaidAmount,
          paidPercent,
          status: "approved",
        });

        if (paidPercent >= 30) {
          const productsInContract =
            typeof contract.products === "string"
              ? JSON.parse(contract.products)
              : contract.products;
          for (const product of productsInContract) {
            const existingProduct = await getProductByIdService(product.id);
            if (existingProduct && existingProduct.stock >= product.qty) {
              await updateProductService(product.id, {
                stock: existingProduct.stock - product.qty,
              });
            }
          }
        }
      } else if (status === "rejected") {
        updatedPaidAmount -= payment.amount;
        paidPercent = (updatedPaidAmount / contract.totalPrice) * 100;

        await updateContractService(payment.contractId, {
          paidAmount: updatedPaidAmount,
          paidPercent,
          status: "rejected",
        });

        const productsInContract =
          typeof contract.products === "string"
            ? JSON.parse(contract.products)
            : contract.products;
        for (const product of productsInContract) {
          const existingProduct = await getProductByIdService(product.id);
          if (existingProduct) {
            await updateProductService(product.id, {
              stock: existingProduct.stock + product.qty,
            });
          }
        }
      }

      const updatedPayment = await updatePayment(id, { status });
      if (!updatedPayment) {
        return next(
          new ErrorHandler("Sorry, payment not updated, please try again", 404)
        );
      }

      res.status(200).json({
        success: true,
        message: "Payment status updated successfully",
        payment: updatedPayment,
      });
    } catch (error: any) {
      next(new ErrorHandler(`Update Payment Error: ${error.message}`, 500));
    }
  }
);

export const deletePaymentByUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { user } = req as { user: User };

      if (!user) {
        return next(new ErrorHandler("Please login to continue", 404));
      }

      const payment = await getPaymentByIdService(id, user.id);
      if (!payment) {
        return next(new ErrorHandler("Payment not found", 404));
      }

      if (payment.status === "approved") {
        return next(new ErrorHandler("Payment cannot be deleted, it is approved", 400));
      }

      if (payment.receiptImage) {
        const filename = payment.receiptImage.split('/public/payments/')[1];
        const filePath = path.join(__dirname, '../../../public/payments', filename);
        fs.promises.unlink(filePath).catch(err => {
          console.error("Failed to delete image file:", err);
        });
      }

      await deletePayment(id);

      res.status(200).json({
        success: true,
        message: "Payment deleted successfully",
      });
    } catch (error: any) {
      next(new ErrorHandler(`Delete Payment Error: ${error.message}`, 500));
    }
  }
);

export const deletePaymentByAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) {
        return next(new ErrorHandler("Payment id is required", 400));
      }

      const payment = await getPaymentByIdService(id);
      if (!payment) {
        return next(new ErrorHandler("Payment not found", 404));
      }

      if (payment.status === "approved") {
        return next(new ErrorHandler("Payment cannot be deleted, it is approved", 400));
      }

      if (payment.receiptImage) {
        const filename = payment.receiptImage.split('/public/payments/')[1];
        const filePath = path.join(__dirname, '../../../public/payments', filename);
        await fs.promises.unlink(filePath).catch(err => {
          console.error("Failed to delete image file:", err);
        });
      }

      await deletePayment(id);

      res.status(200).json({
        success: true,
        message: "Payment deleted successfully",
      });
    } catch (error: any) {
      next(new ErrorHandler(`Delete Payment Error: ${error.message}`, 500));
    }
  }
);

export const getNotificationPaymentByAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payments = await getNotificationPaymentByAdminService();
        res.status(200).json({
          success: true,
          message: "Notification payment fetched successfully",
          payments,
        });
    } catch (error: any) {
      next(new ErrorHandler(`Get Notification Payment Error: ${error.message}`, 500));
    }
  }
)



