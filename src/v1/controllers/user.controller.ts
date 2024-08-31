import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import ErrorHandler from "../middleware/ErrorHandler";
import axios from "axios";
import prisma from "../config/db";
import { sendToken } from "../utils/createToken";
import { IDevice, ILegalInfo, IUser } from "../types/user.type";
import requestIp from "request-ip";
import useragent from "express-useragent";
import {
  deleteUserDeviceService,
  findUserDeviceService,
} from "../services/user.service";

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const code = req.headers["x_code"];
    const redirect_uri = req.headers["x_redirect_uri"];
    const clientId = process.env.ONE_ID_CLIENT_ID;
    const clientSecret = process.env.ONE_ID_CLIENT_SECRET;
    const scope = process.env.ONE_ID_SCOPE;
    const ip = requestIp.getClientIp(req); // Foydalanuvchining IP manzilini olish
    const ua = useragent.parse(req.headers["user-agent"] as string); // Foydalanuvchining qurilma ma'lumotlarini olish
    try {
      const getAccessToken = await axios.post(
        "https://sso.egov.uz/sso/oauth/Authorization.do",
        null,
        {
          params: {
            grant_type: "one_authorization_code",
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            redirect_uri: redirect_uri,
          },
        }
      );
      if (getAccessToken.data.error) {
        return next(new ErrorHandler(getAccessToken.data.message, 400));
      }

      const { data } = await axios.post(
        "https://sso.egov.uz/sso/oauth/Authorization.do",
        null,
        {
          params: {
            grant_type: "one_access_token_identify",
            client_id: clientId,
            client_secret: clientSecret,
            access_token: getAccessToken.data.access_token,
            scope: scope,
          },
        }
      );
      if (data.error) {
        return next(new ErrorHandler(data.error.message, 400));
      }

      const findUser = await prisma.user.findUnique({
        where: {
          pin_jshshir: data.pin,
        },
        include: {
          legal_info: true,
          Contract: true,
        },
      });
      const { legal_info } = data;
      let legalDataToCreate = {};

      const basicLegalInfo = legal_info.find(
        (info: any) => info.is_basic === true
      );

      if (basicLegalInfo) {
        legalDataToCreate = {
          create: {
            name: basicLegalInfo.acron_UZ,
            le_name: basicLegalInfo.le_name,
            inn: basicLegalInfo.le_tin,
            tin: basicLegalInfo.tin,
          },
        };
      }

      const findDevice = await prisma.device.findFirst({
        where: {
          ip: ip || "",
          browser: ua.browser || "",
          os: ua.os || "",
          device: ua.platform || "",
          userId: findUser?.id as string,
        },
      });
       let user : IUser | any;

      if (!findUser) {
      user = await prisma.user.create({
          data: {
            pin_jshshir: data.pin,
            user_id: data.user_id,
            user_type: data.user_type,
            valid: Boolean(data.valid),
            passport_no: data.pport_no,
            birth_date: data.birth_date,
            birth_place: data.birth_place,
            first_name: data.first_name,
            full_name: data.full_name,
            legal_info: basicLegalInfo ? legalDataToCreate : undefined,
            is_LLC: basicLegalInfo ? true : false,
            sur_name: data.sur_name,
            middle_name: data.mid_name,
          },
          include: {
            legal_info: true,
            Device: true,
          },
        });
      } else if (findUser) {
        if (findUser.legal_info && basicLegalInfo) {
          await prisma.legalInfo.update({
            where: {
              id: findUser.legal_info.id,
            },
            data: basicLegalInfo
              ? {
                  name: basicLegalInfo.acron_UZ,
                  le_name: basicLegalInfo.le_name,
                  inn: basicLegalInfo.le_tin,
                  tin: basicLegalInfo.tin,
                }
              : findUser.legal_info,
          });
          user = await prisma.user.findUnique({
            where: {
              id: findUser.id,
            },
            include: {
              legal_info: true,
              Device: true,
            },
          });
        } else if (findUser.legal_info && !basicLegalInfo) {
          user = await prisma.user.update({
            where: {
              pin_jshshir: data.pin,
            },
            include: {
              legal_info: true,
              Device: true,
            },
            data: {
              is_LLC: false,
            },
          });
        }
      }

      if (user) {
        if (!findDevice) {
          await prisma.device.create({
            data: {
              ip: ip || "",
              browser: ua.browser || "",
              os: ua.os || "",
              device: ua.platform || "",
              userId: user?.id as string,
            },
          });
        }
        await sendToken(user as IUser, 200, res);
      } else {
        next(new ErrorHandler("User not found after update", 404));
      }
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
      if (req.user) {
        const user = await prisma.user.findUnique({
          where: {
            id: req.user.id,
          },
          include: {
            legal_info: true,
            Device: true,
          },
        });

        if (!user) {
          next(new ErrorHandler("User not found", 404));
        }
        res.status(200).json({
          message: "User fetched successfully",
          data: user,
        });
      } else {
        next(new ErrorHandler("Please login to access this route", 401));
      }
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
      if (req.user) {
        const userWithLegal = req.user as IUser & { legal_info: ILegalInfo };
        if (userWithLegal.legal_info) {
          if (
            address === "" ||
            phone_number === "" ||
            oked === "" ||
            x_r === "" ||
            bank === "" ||
            mfo === ""
          ) {
            next(new ErrorHandler("Please fill all the fields", 400));
          }
          await prisma.legalInfo.update({
            where: {
              userId: userWithLegal.id,
            },
            data: {
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
            },
          });
          const updateUser = await prisma.user.update({
            where: {
              id: userWithLegal.id,
            },
            include: {
              legal_info: true,
            },
            data: {
              is_LLC: true,
            },
          });
          res.status(200).json({
            message: "User updated successfully",
            data: {
              user: updateUser,
            },
          });
        } else {
          if (address === "" || phone_number === "") {
            next(new ErrorHandler("Please fill all the fields", 400));
          }
          const updateUser = await prisma.user.update({
            where: {
              id: req.user.id,
            },
            include: {
              legal_info: true,
            },
            data: {
              address,
              phone_number,
              is_LLC: false,
            },
          });
          res.status(200).json({
            message: "User updated successfully",
            data: updateUser,
          });
        }
      } else {
        next(new ErrorHandler("Please login to access this route", 401));
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
