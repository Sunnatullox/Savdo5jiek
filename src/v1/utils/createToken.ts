import asyncHandler from "express-async-handler";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import {
  signAccessToken,
  signRefreshToken,
} from "../services/adminstration.service";
import ErrorHandler from "../middleware/ErrorHandler";
import prisma from "../config/db";
import { IUser } from "../types/user.type";
import { Administrator } from "../types/adminstrator.type";
declare global {
  namespace Express {
    interface Request {
      user?: IUser | undefined;
      adminstrator?: Administrator | undefined;
    }
  }
}

interface IActivationToken {
  token: string;
  activationCode: string;
}

export const createActivationToken = (user: IUser): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_TOKEN_SECRET as Secret,
    {
      expiresIn: "5m",
    }
  );
  return { token, activationCode };
};

interface ITokenOptions {
  expires: Date;
  maxAge?: number;
  signed?: boolean;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}


export const accessTokenExpire = parseInt(
  (process.env.ACCESS_TOKEN_EXPIRE as string) || "1200",
  10
);
export const refreshTokenExpire = parseInt(
  (process.env.REFRESH_TOKEN_EXPIRE as string) || "1200",
  10
);


export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000), 
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000, 
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  secure: process.env.NODE_ENV === "production", 
};

export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000), 
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000, 
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
  secure: process.env.NODE_ENV === "production", 
};


export const sendTokenAdmin = async (
  user: Administrator,
  statusCode: number,
  res: Response
) => {
  const accessToken = await signAccessToken(user.id);
  const refreshToken = await signRefreshToken(user.id);
  const { password: _, twoFactorSecret: __, ...userData } = user;


  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  res
    .status(statusCode)
    .json({ success: true, message: "Login successful", data: userData });
};

export const sendToken = async (
  user: IUser,
  statusCode: number,
  res: Response
) => {
  const accessToken = await signAccessToken(user.id);
  const refreshToken = await signRefreshToken(user.id);
  const {
    user_id: _,
    ...userData
      } = user as IUser & { twoFactorSecret: string };

  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  res
    .status(statusCode)
    .json({ success: true, message: "Login successful", user: userData });
};

export const updateAccessTokenUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;
      
      if (!refresh_token) {
        return next(
          new ErrorHandler("Please login to access this resource", 401)
        );
      }

      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN_SECRET as string
      ) as JwtPayload;

      if (!decoded) {
        return next(new ErrorHandler("refresh token is not valid", 401));
      }

      
      const user = await prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
      });

      if (!user) {
        return next(new ErrorHandler("Please login to access this resource", 401));
      }

      const accessToken = await signAccessToken(user.id);
      const refreshToken = await signRefreshToken(user.id);

      req.user = user as IUser;

      // Set cookies before calling next()
      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);
      return next(); // Ensure no further response is sent after this
    } catch (error) {
      console.log(error);
      return next(
        new ErrorHandler("Please login to access this resource", 401)
      );
    }
    finally {
      await prisma.$disconnect();
    }
  }
);

export const updateAccessTokenAdministrator = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;
      if (!refresh_token) {
        return next(
          new ErrorHandler("Please login to access this resource", 401)
        );
      }

      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN_SECRET as string
      ) as JwtPayload;

      if (!decoded) {
        return next(new ErrorHandler("refresh token is not valid", 401));
      }

      const adminstrator = await prisma.administration.findUnique({
        where: {
          id: decoded.id,
        },
      });
      if (!adminstrator) {
        return next(new ErrorHandler("Administrator not found", 404));
      }

      const accessToken = await signAccessToken(adminstrator.id);
      const refreshToken = await signRefreshToken(adminstrator.id);

      req.adminstrator = adminstrator as Administrator;

      // Set cookies before calling next()
      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);
      return next(); // Ensure no further response is sent after this
    } catch (error) {
      console.log(error);
      return next(
        new ErrorHandler("Please login to access this resource", 401)
      );
    }
    finally {
      await prisma.$disconnect();
    }
  }
);
