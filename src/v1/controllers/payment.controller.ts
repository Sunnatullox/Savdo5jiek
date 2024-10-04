import path from "path";
import fs from "fs";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import ErrorHandler from "../middleware/ErrorHandler";
import { Prisma } from "@prisma/client";
import {
  createPayment,
  deletePayment,
  getNotificationPaymentByAdminService,
  getPaymentByIdService,
  getPaymentsByAdminService,
  getPaymentsByContractIdAdminService,
  getPaymentsByUserIdService,
  getPaymentsByUserService,
  updatePayment,
  updatePaymentAndContractStatus,
} from "../services/payment.service";
import { getContractByIdService } from "../services/contract.service";
import { IUser } from "../types/user.type";
import { IPayment } from "../types/payment.type";

export const createPaymentUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { amount, paidDate } = req.body;
      const { user } = req as { user: IUser };
      const { file } = req as { file: Express.Multer.File };

      if (!user) {
        return next(new ErrorHandler("Please login to continue", 404));
      }

      if (!id || !amount || !file || !paidDate) {
        return next(new ErrorHandler("All fields are required", 400));
      }

      const imagePath = `${req.protocol}://${req.get("host")}/public/payments/${
        file.filename
      }`;

      const findContract = await getContractByIdService(id, user.id);
      if (!findContract) {
        return next(
          new ErrorHandler(
            "Invalid contract ID or the contract doesn't belong to you",
            404
          )
        );
      }

      const payment = await createPayment({
        amount: Number(amount),
        paidDate: new Date(paidDate),
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
      console.log("Create Payment Error ", error);
      next(new ErrorHandler(`Create Payment Error: ${error.message}`, 500));
    }
  }
);

export const getPaymentsByUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req as { user: IUser };

      if (!user) {
        return next(new ErrorHandler("Please login to continue", 404));
      }

      const payments = await getPaymentsByUserService(user.id);

      res.status(200).json({
        success: true,
        message: "Payment fetched successfully",
        payments,
      });
    } catch (error: any) {
      next(new ErrorHandler(`Get Payment Error: ${error.message}`, 500));
    }
  }
);

export const getPaymentById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req as { user: IUser };
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
      const { user } = req as { user: IUser };

      if (!user) {
        return next(new ErrorHandler("Please login to continue", 404));
      }

      if (!id) {
        return next(new ErrorHandler("Contract id is required", 400));
      }

      const payments = (await getPaymentsByUserIdService(
        id,
        user.id
      )) as IPayment[];

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

      if (payments.isRead === false) {
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

export const getPaymentsByAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payments = await getPaymentsByAdminService();
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
);

export const updatePaymentByUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { amount, paidDate } = req.body;
      const { user } = req as { user: IUser };
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
        return next(
          new ErrorHandler("Payment cannot be updated, it is approved", 400)
        );
      }

      let updateData = {
        amount: Number(amount),
        paidDate: new Date(paidDate),
      } as Prisma.PaymentUpdateInput;

      if (file) {
        const imagePath = `${req.protocol}://${req.get(
          "host"
        )}/public/payments/${file.filename}`;
        updateData.receiptImage = imagePath;

        if (
          findPayment.receiptImage &&
          findPayment.receiptImage !== imagePath
        ) {
          const filename =
            findPayment.receiptImage.split("/public/payments/")[1];
          const filePath = path.join(
            __dirname,
            "../../../public/payments",
            filename
          );
          fs.unlink(filePath, (err) => {
            if (err && err.code !== 'ENOENT') {
              throw err;
            }
          });
        } else {
          updateData.receiptImage = imagePath;
        }
      }

      const payment = await updatePayment(id, updateData, user.id);

      if (!payment) {
        return next(
          new ErrorHandler("Sorry, payment not updated, please try again", 404)
        );
      }

      res.status(200).json({
        success: true,
        message: "Payment updated successfully",
        payment,
      });
    } catch (error: any) {
      console.log("Update Payment Error ", error);
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
        return next(
          new ErrorHandler("Sorry, payment not updated, please try again", 404)
        );
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
    const { id } = req.params; // Payment ID
    const { status } = req.body;

    if (status !== "approved" && status !== "rejected") {
      return next(new ErrorHandler("Invalid status", 400));
    }

    try {
      const updatedPayment = await updatePaymentAndContractStatus(id, status);
      res.status(200).json({
        success: true,
        message: "Payment and contract status updated successfully",
        payment: updatedPayment,
      });
    } catch (error: any) {
      console.log("Update Payment Status Error ", error);
      next(new ErrorHandler(`Update Payment Status Error: ${error.message}`, 500));
    }
  }
);

export const deletePaymentByUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { user } = req as { user: IUser };

      if (!user) {
        return next(new ErrorHandler("Please login to continue", 404));
      }

      const payment = await getPaymentByIdService(id, user.id);
      if (!payment) {
        return next(new ErrorHandler("Payment not found", 404));
      }

      if (payment.status === "approved") {
        return next(
          new ErrorHandler("Payment cannot be deleted, it is approved", 400)
        );
      }

      if (payment.receiptImage) {
        const filename = payment.receiptImage.split("/public/payments/")[1];
        const filePath = path.join(
          __dirname,
          "../../../public/payments",
          filename
        );
        fs.unlink(filePath, (err) => {
          if (err && err.code !== 'ENOENT') {
            throw err;
          }
        });
      }

      await deletePayment(payment.id);

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
        return next(
          new ErrorHandler("Payment cannot be deleted, it is approved", 400)
        );
      }

      if (payment.receiptImage) {
        const filename = payment.receiptImage.split("/public/payments/")[1];
        const filePath = path.join(
          __dirname,
          "../../../public/payments",
          filename
        );
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Failed to delete image file:", err);
          }
        });
      }

      await deletePayment(payment.id);

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
      next(
        new ErrorHandler(
          `Get Notification Payment Error: ${error.message}`,
          500
        )
      );
    }
  }
);
