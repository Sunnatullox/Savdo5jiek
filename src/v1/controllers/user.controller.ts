import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import ErrorHandler from "../middleware/ErrorHandler";
import { sendToken } from "../utils/createToken";
import { ILegalInfo, IUser } from "../types/user.type";
import requestIp from "request-ip";
import useragent from "express-useragent";
import {
  deleteUserDeviceService,
  findOrCreateDevice,
  findOrCreateUser,
  findUserDeviceService,
  getAccessToken,
  getUserById,
  getUserData,
  updateUser,
  updateUserLegalInfo,
} from "../services/user.service";

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("req.headers", req.headers);
    const code = req.body.code as string;
    const redirect_uri = process.env.ONE_ID_REDIRECT_URI as string;
    const ip = requestIp.getClientIp(req);
    const ua = useragent.parse(req.headers["user-agent"] as string);

    try {
      console.log("code", code);
      const accessTokenData = await getAccessToken(code, redirect_uri);
      const userData = await getUserData(accessTokenData.access_token);
      const user = await findOrCreateUser(userData) as IUser;
      await findOrCreateDevice(user, ip || "", ua);
      await sendToken(user, 200, res);
    } catch (error: any) {
      console.log("Login error", error);
      next(new ErrorHandler("Error processing Login please try again", 500));
    }
  }
);

export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.status(200).json({
      message: "Logout successful",
      success: true,
    });
  }
);

export const getUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new ErrorHandler("Please login to access this route", 401));
      }

      const user = await getUserById(req.user.id) as IUser;
      res.status(200).json({
        message: "User fetched successfully",
        data: user,
      });
    } catch (error: any) {
      next(new ErrorHandler(error.message, 500));
    }
  }
);

export const updateUserData = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        address = "",
        phone_number = "",
        oked = "",
        x_r = "",
        bank = "",
        mfo = "",
      } = req.body;

      if (!req.user) {
        return next(new ErrorHandler("Please login to access this route", 401));
      }

      const userWithLegal = req.user as IUser & { legal_info: ILegalInfo };

      if (userWithLegal.legal_info) {
        if (
          !address ||
          !phone_number ||
          !oked ||
          !x_r ||
          !bank ||
          !mfo
        ) {
          return next(new ErrorHandler("Please fill all the fields", 400));
        }

        const updatedLegalInfo = await updateUserLegalInfo(userWithLegal.id, {
          address,
          phone_number,
          oked,
          x_r,
          bank,
          mfo,
          tin: userWithLegal.legal_info.tin,
          inn: userWithLegal.legal_info.inn,
          le_name: userWithLegal.legal_info.le_name,
          name: userWithLegal.legal_info.name,
          organizationLeader: userWithLegal.full_name,
        });

        const updatedUser = await updateUser(userWithLegal.id, {
          is_LLC: true,
        });

        res.status(200).json({
          message: "User updated successfully",
          data: {
            user: updatedUser,
            legal_info: updatedLegalInfo,
          },
        });
      } else {
        if (!address || !phone_number) {
          return next(new ErrorHandler("Please fill all the fields", 400));
        }

        const updatedUser = await updateUser(req.user.id, {
          address,
          phone_number,
          is_LLC: false,
        });

        res.status(200).json({
          message: "User updated successfully",
          data: updatedUser,
        });
      }
    } catch (error: any) {
      console.log("Update user error", error);
      next(new ErrorHandler(error.message, 500));
    }
  }
);

export const deleteUserDevice = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const device_id = req.params.device_id;
      const findDevice = await findUserDeviceService(
        device_id,
        req.user?.id as string
      );
      if (!findDevice) {
        return next(new ErrorHandler("Device not found", 400));
      }

      await deleteUserDeviceService(device_id, req.user?.id as string);

      res.status(200).json({
        success: true,
        message: "Device deleted successfully",
      });
    } catch (error: any) {
      console.log("Delete device error", error);
      next(new ErrorHandler(error.message, 500));
    }
  }
);
