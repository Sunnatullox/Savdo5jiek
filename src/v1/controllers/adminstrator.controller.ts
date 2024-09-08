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
} from "../services/adminstration.service";
import { sendTokenAdmin } from "../utils/createToken";
import { compare, hash } from "bcryptjs";
import { AdminInfo, Administrator } from "../types/adminstrator.type";
import requestIp from "request-ip";
import useragent from "express-useragent";
import { IDevice } from "../types/user.type";

export const adminstratorOTP = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      // Delete old and unverified OTP records
      await prisma.oTP.deleteMany({
        where: {
          expiresAt: { lt: new Date() },
          verified: false,
        },
      });

      if (!["admin", "tax_agent"].includes(req.query.type as string)) {
        return next(new ErrorHandler("Invalid type", 400));
      }
      const role = req.query.type === "admin" ? "ADMIN" : "TAX_AGENT";

      const checkAdmin = await prisma.administration.findFirst({
        where: { role, email },
      });

      if (checkAdmin) {
        return next(new ErrorHandler("Admin already exists", 400));
      }
      const otp = otpGenerator.generate(5, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      const gmailInfo = await mailSender(
        process.env.SENDER_EMAIL as string,
        "OTP Email Verification",
        emailForgotTemplate(otp, name, role)
      );
      
      console.log("gmailInfo", gmailInfo);
      await prisma.oTP.create({
        data: {
          email,
          user: { name, email, password, role },
          code: otp,
          type: role,
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
      const role = req.query.type === "admin" ? "ADMIN" : "TAX_AGENT";

      const checkOTP = await prisma.oTP.findFirst({
        where: {
          email,
          expiresAt: { gt: new Date() },
          verified: false,
          type: role,
        },
      });

      if (!checkOTP) {
        return next(new ErrorHandler("OTP not found", 400));
      }

      if (checkOTP.code !== otp) {
        return next(new ErrorHandler("Invalid OTP", 400));
      }

      if (checkOTP.expiresAt < new Date()) {
        await prisma.oTP.delete({ where: { id: checkOTP.id } });
        return next(new ErrorHandler("OTP expired", 400));
      }

      const adminData: Omit<Administrator, "id" | "createdAt" | "updatedAt"> = {
        ...(checkOTP.user as unknown as Administrator),
        isTwoFactorAuth: false,
        twoFactorSecret: "",
      };

      await createAdministration(adminData);

      await prisma.oTP.delete({ where: { id: checkOTP.id } });

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
      const ip = requestIp.getClientIp(req);
      const ua = useragent.parse(req.headers["user-agent"] as string);

      const checkUser = (await prisma.administration.findUnique({
        where: { email },
        include: { Device: true },
      })) as Administrator;

      if (!checkUser) {
        return next(new ErrorHandler("User not found", 400));
      }

      if (!(await comparePassword(password, checkUser.password))) {
        return next(new ErrorHandler("Invalid password", 400));
      }

      const findDevice = (checkUser.Device as IDevice[])
        ? await findAdminDeviceService({
            ip,
            browser: ua.browser || "",
            os: ua.os || "",
            device: ua.platform || "",
            administrationId: checkUser.id,
          })
        : null;

      if (checkUser.twoFactorSecret) {
        if (!twoFactorSecret) {
          return next(new ErrorHandler("Two factor secret is required", 400));
        }
        if (!(await compare(twoFactorSecret, checkUser.twoFactorSecret))) {
          return next(new ErrorHandler("Invalid two factor secret", 400));
        }
      }

      if (!findDevice) {
        await prisma.device.create({
          data: {
            ip: ip || "",
            browser: ua.browser || "",
            os: ua.os || "",
            device: ua.platform || "",
            administrationId: checkUser.id,
          },
        });
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

      const adminInfoData = {
        company_name: company_name || findAdmin.AdminInfo?.company_name,
        first_name: first_name || findAdmin.AdminInfo?.first_name,
        middle_name: middle_name || findAdmin.AdminInfo?.middle_name,
        sur_name: sur_name || findAdmin.AdminInfo?.sur_name,
        address: address || findAdmin.AdminInfo?.address,
        tel: tel || findAdmin.AdminInfo?.tel,
        inn: inn || findAdmin.AdminInfo?.inn,
        oked: oked || findAdmin.AdminInfo?.oked,
        x_r: x_r || findAdmin.AdminInfo?.x_r,
        bank: bank || findAdmin.AdminInfo?.bank,
        mfo: mfo || findAdmin.AdminInfo?.mfo,
        organizationLeader:
          `${first_name.charAt(0).toUpperCase()}.${middle_name
            .charAt(0)
            .toUpperCase()}.${
            sur_name.charAt(0).toUpperCase() + sur_name.slice(1)
          }` || findAdmin.AdminInfo?.organizationLeader,
        administrationId: req.adminstrator?.id as string,
      };

      if (findAdmin.AdminInfo) {
        await adminstratorUpdateInfoService(
          adminInfoData as Omit<AdminInfo, "id" | "createdAt" | "updatedAt">
        );
      } else {
        await adminstratorAddInfoService(
          adminInfoData as Omit<AdminInfo, "id" | "createdAt" | "updatedAt">
        );
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

export const adminstratorTwoFactorAuthUpdateAndCreate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { secret, oldSecret = "" } = req.body;
      const findAdmin = await administrationFind(
        req.adminstrator?.id as string
      );

      if (!findAdmin || findAdmin.role !== "ADMIN") {
        return next(new ErrorHandler("Admin not found", 400));
      }

      const twoFactorSecretHash = await hash(secret, 10);

      if (findAdmin.twoFactorSecret) {
        if (!oldSecret) {
          return next(new ErrorHandler("Old secret is required", 400));
        }
        if (!(await compare(oldSecret, findAdmin.twoFactorSecret))) {
          return next(new ErrorHandler("Invalid old secret", 400));
        }
      }

      await prisma.administration.update({
        where: { id: req.adminstrator?.id as string },
        data: {
          twoFactorSecret: twoFactorSecretHash,
          isTwoFactorAuth: true,
        },
      });

      res.status(200).json({
        success: true,
        message: "Two factor authentication enabled",
      });
    } catch (error: any) {
      console.log("Error updating two factor authentication", error);
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const getAdminstratorInfo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.adminstrator) {
        return next(new ErrorHandler("Please login to get admin info", 400));
      }

      const findAdmin = await administrationFind(
        req.adminstrator?.id as string
      );

      if (!findAdmin) {
        return next(new ErrorHandler("Administrator not found", 400));
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
      const findDevice = await findAdminDeviceService({
        administrationId: req.adminstrator?.id as string,
        device_id,
      });

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

export const deleteAdminProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.adminstrator as Administrator;
      const findAdmin = await administrationFind(id);
      if (!findAdmin) {
        return next(new ErrorHandler("Admin not found", 400));
      }
      await prisma.administration.delete({ where: { id } });
      res.status(200).json({
        success: true,
        message: "Admin deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler("Please login to delete profile", 500));
    }
  }
);
