import asyncHandler from "express-async-handler";
import {
  deleteMessageAdminService,
  deleteMessageUserService,
  getMessagesAdminByContractIdService,
  getMessagesUserByContractIdService,
  getNotficationAdminService,
  getNotficationUserService,
  sendMessageAdminService,
  sendMessageUserService,
} from "../services/messages.service";
import { NextFunction, Request, Response } from "express";
import { IUser } from "../types/user.type";
import ErrorHandler from "../middleware/ErrorHandler";
import { Administrator } from "../types/adminstrator.type";

export const sendMessageUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { contractId, message } = req.body;
      const { id } = req.user as IUser;

      if (!contractId || !message) {
        return next(new ErrorHandler("Contract ID and message are required", 400));
      }

      const result = await sendMessageUserService(contractId, id, message);
      res.status(200).json({
        success: true,
        message: "Message sent successfully",
        data: result,
      });
    } catch (error: any) {
      next(new ErrorHandler(`Error sending message: ${error.message}`, error.statusCode || 500));
    }
  }
);

export const sendMessageAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { contractId, message } = req.body;
      const { id } = req.adminstrator as Administrator;

      if (!contractId || !message) {
        return next(new ErrorHandler("Contract ID and message are required", 400));
      }

      const result = await sendMessageAdminService(id, contractId, message);
      res.status(200).json({
        success: true,
        message: "Message sent successfully",
        data: result,
      });
    } catch (error: any) {
      console.log("Message Admin Error", error);
      next(new ErrorHandler(`Error sending message: ${error.message}`, error.statusCode || 500));
    }
  }
);

export const getMessagesAdminByContractId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { contractId } = req.params;

      if (!contractId) {
        return next(new ErrorHandler("Contract ID is required", 400));
      }

      const result = await getMessagesAdminByContractIdService(contractId);
      res.status(200).json({
        success: true,
        message: "Messages fetched successfully",
        data: result,
      });
    } catch (error: any) {
      next(new ErrorHandler(`Error fetching messages: ${error.message}`, error.statusCode || 500));
    }
  }
);

export const getMessagesUserByContractId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { contractId } = req.params;
      const { id } = req.user as IUser;

      if (!contractId) {
        return next(new ErrorHandler("Contract ID is required", 400));
      }

      const result = await getMessagesUserByContractIdService(contractId, id);
      res.status(200).json({
        success: true,
        message: "Messages fetched successfully",
        data: result,
      });
    } catch (error: any) {
      next(new ErrorHandler(`Error fetching messages: ${error.message}`, error.statusCode || 500));
    }
  }
);

export const getNotificationUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user as IUser;

      const result = await getNotficationUserService(id);
      res.status(200).json({
        success: true,
        message: "Notifications fetched successfully",
        data: result,
      });
    } catch (error: any) {
      next(new ErrorHandler(`Error fetching notifications: ${error.message}`, error.statusCode || 500));
    }
  }
);

export const getNotificationAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getNotficationAdminService();
      res.status(200).json({
        success: true,
        message: "Notifications fetched successfully",
        data: result,
      });
    } catch (error: any) {
      next(new ErrorHandler(`Error fetching notifications: ${error.message}`, error.statusCode || 500));
    }
  }
);

export const deleteMessageUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { messageId } = req.params;
      const { id } = req.user as IUser;

      if (!messageId) {
        return next(new ErrorHandler("Message ID is required", 400));
      }

      const message = await getMessagesUserByContractIdService(messageId, id);

      if (!message) {
        return next(new ErrorHandler("Message not found", 404));
      }

      await deleteMessageUserService(messageId, id);
      res.status(200).json({
        success: true,
        message: "Message deleted successfully",
      });
    } catch (error: any) {
      next(new ErrorHandler(`Error deleting message: ${error.message}`, error.statusCode || 500));
    }
  }
);

export const deleteMessageAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { messageId } = req.params;
      const { id } = req.adminstrator as Administrator;

      if (!messageId) {
        return next(new ErrorHandler("Message ID is required", 400));
      }

      const message = await getMessagesAdminByContractIdService(messageId);

      if (!message) {
        return next(new ErrorHandler("Message not found", 404));
      }

      await deleteMessageAdminService(messageId);
      res.status(200).json({
        success: true,
        message: "Message deleted successfully",
      });
    } catch (error: any) {
      next(new ErrorHandler(`Error deleting message: ${error.message}`, error.statusCode || 500));
    }
  }
);