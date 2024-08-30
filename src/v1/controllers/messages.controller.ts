import asyncHandler from "express-async-handler";
import {
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
      const result = await sendMessageUserService(contractId, id, message);
      res.status(200).json({
        success: true,
        message: "Message sent successfully",
        data: result,
      });
    } catch (error: any) {
      next(
        new ErrorHandler(
          `Error sending message: ${error.message}`,
          error.statusCode || 500
        )
      );
    }
  }
);

export const sendMessageAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { contractId, message } = req.body;
      const { id } = req.adminstrator as Administrator;
      const result = await sendMessageAdminService(id, contractId, message);
      res.status(200).json({
        success: true,
        message: "Message sent successfully",
        data: result,
      });
    } catch (error: any) {
      next(
        new ErrorHandler(
          `Error sending message: ${error.message}`,
          error.statusCode || 500
        )
      );
    }
  }
);

export const getMessagesAdminByContractId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { contractId } = req.params;
      const result = await getMessagesAdminByContractIdService(contractId);
      res.status(200).json({
        success: true,
        message: "Messages fetched successfully",
        data: result,
      });
    } catch (error: any) {
      next(
        new ErrorHandler(
          `Error fetching messages: ${error.message}`,
          error.statusCode || 500
        )
      );
    }
  }
);

export const getMessagesUserByContractId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { contractId } = req.params;
      const { id } = req.user as IUser;
      const result = await getMessagesUserByContractIdService(contractId, id);
      res.status(200).json({
        success: true,
        message: "Messages fetched successfully",
        data: result,
      });
    } catch (error: any) {
      next(
        new ErrorHandler(
          `Error fetching messages: ${error.message}`,
          error.statusCode || 500
        )
      );
    }
  }
);

export const getNotficationUser = asyncHandler(
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
      next(
        new ErrorHandler(
          `Error fetching messages: ${error.message}`,
          error.statusCode || 500
        )
      );
    }
  }
);

export const getNotficationAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getNotficationAdminService();
      res.status(200).json({
        success: true,
        message: "Notifications fetched successfully",
        data: result,
      });
    } catch (error: any) {
      next(
        new ErrorHandler(
          `Error fetching messages: ${error.message}`,
          error.statusCode || 500
        )
      );
    }
  }
);
