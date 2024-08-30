import jwt, { JwtPayload } from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import ErrorHandler from './ErrorHandler';
import prisma from '../config/db';
import { updateAccessTokenAdministrator, updateAccessTokenUser } from '../utils/createToken';
import { IUser } from '../types/user.type';
import { Administrator, Role } from '../types/adminstrator.type';


declare global {
    namespace Express {
      interface Request {
        user?: IUser | undefined;
        adminstrator?: Administrator | undefined;
      }
    }
  }

export const isAuthenticatedUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const access_token =
          req.cookies.access_token || "";
        if (!access_token) {
          return next(
            new ErrorHandler("Please login to access this resource", 401)
          );
        }
        const decoded = jwt.decode(access_token) as JwtPayload;
  
        if (!decoded) {
          return next(new ErrorHandler("access token is not valid", 401));
        }
  
        if (decoded.exp && decoded.exp <= Date.now() / 1000) {
          try {
            await updateAccessTokenUser(req, res, next);
            if (res.headersSent) return; // Ensure no further response is sent after this
          } catch (error) {
            return next(
              new ErrorHandler("Please login to access this resource", 401)
            );
          }
        } else {
          const user = await prisma.user.findUnique({
            where: {
              id: decoded.id,
            },
            include: {
              legal_info: true,
            },
          });
  
          if (!user) {
            return next(
              new ErrorHandler("Please login to access this resource", 401)
            );
          }
  
          req.user = user as IUser;
          next();
        }
      } catch (error) {
        return next(new ErrorHandler("Access token is not valid", 401));
      }
    }
  );

export const isAuthenticatedAdminstrator = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const access_token =
          req.cookies.access_token || "";

        if (!access_token) {
          return next(
            new ErrorHandler("Please login to access this resource", 401)
          );
        }
        const decoded = jwt.decode(access_token) as JwtPayload;
  
        if (!decoded) {
          return next(new ErrorHandler("access token is not valid", 401));
        }
  
        if (decoded.exp && decoded.exp <= Date.now() / 1000) {
          try {
            await updateAccessTokenAdministrator(req, res, next);
            if (res.headersSent) return; // Ensure no further response is sent after this
          } catch (error) {
            return next(
              new ErrorHandler("Please login to access this resource", 401)
            );
          }
        } else {
          const adminstrator = await prisma.administration.findUnique({
            where: {
              id: decoded.id,
            },
          });
  
          if (!adminstrator) {
            return next(
              new ErrorHandler("Please login to access this resource", 401)
            );
          }
  
          req.adminstrator = adminstrator as Administrator;
          next();
        }
      } catch (error) {
        return next(new ErrorHandler("Access token is not valid", 401));
      }
    }
  );

  // check if the user is adminstrator
export const isAdministrator = (...roles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.adminstrator) {
        return next(
          new ErrorHandler("Please login to access this resource", 401)
        );
      }
      if (!roles.includes(req.adminstrator.role)) {
        return next(
          new ErrorHandler("You are not authorized to access this resource", 403)
        );
      }
      next();
    };
  };

