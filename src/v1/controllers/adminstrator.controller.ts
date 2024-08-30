import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import ErrorHandler from "../middleware/ErrorHandler";
import prisma from "../config/db";
import otpGenerator from "otp-generator";
import { mailSender } from "../utils/emailSender";
import emailForgotTemplate from "../gmail/emailAdminstratorTemp";
import {
  administrationFind,
  adminstratorAddInfoService,
  adminstratorUpdateInfoService,
  comparePassword,
  createAdministration,
  deleteAdminDeviceService,
  findAdminDeviceService,
} from "../services/administration.service";
import { sendTokenAdmin } from "../utils/createToken";
import { compare, hash } from "bcryptjs";
import { Administrator, Role } from "../types/adminstrator.type";
import requestIp from "request-ip";
import useragent from "express-useragent";

export const adminstratorOTP = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      // Eski va tasdiqlanmagan OTP yozuvlarini o'chirish
      await prisma.oTP.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
          verified: false,
        },
      });

      const checkUser = await prisma.administration.findUnique({
        where: {
          email,
          role: req.query.type === "admin" ? "ADMIN" : "TAX_AGENT",
        },
      });

      if (req.query.type === "admin") {
        const checkAdmin = await prisma.administration.findMany({
          where: {
            role: "ADMIN",
          },
        });
        if (checkAdmin.length > 0) {
          return next(new ErrorHandler("Admin already exists", 400));
        }
      }

      if (req.query.type !== "admin" && req.query.type !== "tax_agent") {
        return next(new ErrorHandler("Invalid type", 400));
      }

      if (checkUser) {
        return next(new ErrorHandler("User already exists", 400));
      }

      const otp = otpGenerator.generate(5, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      await mailSender(
        process.env.SENDER_EMAIL as string,
        "OTP Email Verificatsiya Tekshiruvi",
        emailForgotTemplate(otp, name)
      );

      await prisma.oTP.create({
        data: {
          email,
          user: {
            name,
            email,
            password,
            role: req.query.type === "admin" ? "ADMIN" : "TAX_AGENT",
          },
          code: otp,
          type: req.query.type === "admin" ? "ADMIN" : "TAX_AGENT",
          expiresAt: new Date(Date.now() + 1000 * 60 * 5),
        },
      });

      res.status(200).json({
        success: true,
        message: "OTP sent to email",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const adminstratorOTPVerify = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, otp } = req.body;

      const checkOTP = await prisma.oTP.findFirst({
        where: {
          email,
          expiresAt: {
            gt: new Date(),
          },
          verified: false,
          type: req.query.type === "admin" ? "ADMIN" : "TAX_AGENT",
        },
      });

      if (!checkOTP) {
        return next(new ErrorHandler("OTP not found", 400));
      }

      if (checkOTP.code !== otp) {
        return next(new ErrorHandler("Invalid OTP", 400));
      }

      if (checkOTP.expiresAt < new Date()) {
        await prisma.oTP.delete({
          where: {
            id: checkOTP.id,
          },
        });
        return next(new ErrorHandler("OTP expired", 400));
      }

      await prisma.oTP.update({
        where: {
          id: checkOTP.id,
        },
        data: {
          verified: true,
        },
      });

      await createAdministration(
        checkOTP.user as {
          name: string;
          email: string;
          password: string;
          role: Role;
          twoFactorSecret: string | null;
          isTwoFactorAuth: boolean | null;
        }
      );

      await prisma.oTP.delete({
        where: {
          id: checkOTP.id,
        },
      });

      res.status(200).json({
        success: true,
        message: "OTP verified and Administration created",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const adminstratorLogin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, twoFactorSecret } = req.body;
      const ip = requestIp.getClientIp(req); // Foydalanuvchining IP manzilini olish
      const ua = useragent.parse(req.headers["user-agent"] as string); // Foydalanuvchining qurilma ma'lumotlarini olish

      const checkUser = (await prisma.administration.findUnique({
        where: {
          email,
        },
        include: {
          Device: true,
        },
      })) as Administrator;

      if (!checkUser) {
        return next(new ErrorHandler("User not found", 400));
      }

      if (!comparePassword(password, checkUser.password)) {
        return next(new ErrorHandler("Invalid password", 400));
      }

      const findDevice = await findAdminDeviceService(checkUser.id);

      if (!findDevice) {
        await prisma.device.create({
          data: {
            ip: ip,
            browser: ua.browser,
            os: ua.os,
            device: ua.device,
            administrationId: checkUser.id,
          },
        });
      }
      if (checkUser.twoFactorSecret) {
        if (!twoFactorSecret) {
          return next(new ErrorHandler("Two factor secret is required", 400));
        }
        const checkTwoFactorSecret = await compare(
          twoFactorSecret,
          checkUser.twoFactorSecret
        );
        if (!checkTwoFactorSecret) {
          return next(new ErrorHandler("Invalid two factor secret", 400));
        }
      }

      sendTokenAdmin(checkUser, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const adminstratorAddAndUpdateInfo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        company_name,
        first_name,
        middle_name,
        sur_name,
        address,
        tel,
        inn,
        oked,
        x_r,
        bank,
        mfo,
      } = req.body;

      const findAdmin = await administrationFind(
        req.adminstrator?.id as string
      );

      if (!findAdmin || findAdmin.role !== "ADMIN") {
        return next(new ErrorHandler("Admin not found", 400));
      }

      if (findAdmin.AdminInfo) {
        await adminstratorUpdateInfoService({
          company_name: company_name || findAdmin.AdminInfo.company_name,
          first_name: first_name || findAdmin.AdminInfo.first_name,
          middle_name: middle_name || findAdmin.AdminInfo.middle_name,
          sur_name: sur_name || findAdmin.AdminInfo.sur_name,
          address: address || findAdmin.AdminInfo.address,
          tel: tel || findAdmin.AdminInfo.tel,
          inn: inn || findAdmin.AdminInfo.inn,
          oked: oked || findAdmin.AdminInfo.oked,
          x_r: x_r || findAdmin.AdminInfo.x_r,
          bank: bank || findAdmin.AdminInfo.bank,
          mfo: mfo || findAdmin.AdminInfo.mfo,
          organizationLeader:
            `${first_name.charAt(0).toUpperCase()}.${middle_name
              .charAt(0)
              .toUpperCase()}.${
              sur_name.charAt(0).toUpperCase() + sur_name.slice(1)
            }` || findAdmin.AdminInfo.organizationLeader,
          administrationId: req.adminstrator?.id as string,
        });
      } else {
        await adminstratorAddInfoService({
          company_name,
          first_name,
          middle_name,
          sur_name,
          address,
          tel,
          inn,
          oked,
          x_r,
          bank,
          mfo,
          organizationLeader: `${first_name
            .charAt(0)
            .toUpperCase()}.${middle_name.charAt(0).toUpperCase()}.${
            sur_name.charAt(0).toUpperCase() + sur_name.slice(1)
          }`,
          administrationId: req.adminstrator?.id as string,
        });
      }

      res.status(200).json({
        success: true,
        message: "Admin info added or updated successfully",
      });
    } catch (error: any) {
      console.log("Error updating admin info", error);
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const adminstratorTwoFactorAuthUpdate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { secret, oldSecret = "" } = req.body;
      const findAdmin = await administrationFind(req.user?.id as string);
      if (!findAdmin || findAdmin.role !== "ADMIN") {
        return next(new ErrorHandler("Admin not found", 400));
      }
      const twoFactorSecretHash = await hash(secret, 10);

      if (findAdmin.twoFactorSecret) {
        if (!oldSecret) {
          return next(new ErrorHandler("Old secret is required", 400));
        }
        const checkOldSecret = await compare(
          oldSecret,
          findAdmin.twoFactorSecret
        );
        if (!checkOldSecret) {
          return next(new ErrorHandler("Invalid old secret", 400));
        }
        await prisma.administration.update({
          where: {
            id: req.user?.id as string,
          },
          data: {
            twoFactorSecret: twoFactorSecretHash,
            isTwoFactorAuth: true,
          },
        });
      } else {
        await prisma.administration.update({
          where: {
            id: req.user?.id as string,
          },
          data: {
            twoFactorSecret: twoFactorSecretHash,
          },
        });
      }

      res.status(200).json({
        success: true,
        message: "Two factor authentication enabled",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const getAdminstratorInfo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.adminstrator) {
        return next(new ErrorHandler("Pliese login to get admin info", 400));
      }
      const findAdmin = await administrationFind(
        req.adminstrator?.id as string
      );
      if (!findAdmin) {
        return next(new ErrorHandler("AdminStra not found", 400));
      }
      res.status(200).json({
        success: true,
        message: "Admin info",
        data: findAdmin,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const deleteAdminDevice = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const device_id = req.params.device_id;
      const findDevice = await findAdminDeviceService(device_id);
      if (!findDevice) {
        return next(new ErrorHandler("Device not found", 400));
      }
      await deleteAdminDeviceService(device_id);
      res.status(200).json({
        success: true,
        message: "Device deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
