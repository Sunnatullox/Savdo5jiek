"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdministrator = exports.isAuthenticatedAdminstrator = exports.isAuthenticatedUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ErrorHandler_1 = __importDefault(require("./ErrorHandler"));
const db_1 = __importDefault(require("../config/db"));
const createToken_1 = require("../utils/createToken");
exports.isAuthenticatedUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const access_token = req.cookies.access_token || "";
        if (!access_token) {
            return next(new ErrorHandler_1.default("Please login to access this resource", 401));
        }
        const decoded = jsonwebtoken_1.default.decode(access_token);
        if (!decoded) {
            return next(new ErrorHandler_1.default("access token is not valid", 401));
        }
        if (decoded.exp && decoded.exp <= Date.now() / 1000) {
            try {
                yield (0, createToken_1.updateAccessTokenUser)(req, res, next);
                if (res.headersSent)
                    return; // Ensure no further response is sent after this
            }
            catch (error) {
                return next(new ErrorHandler_1.default("Please login to access this resource", 401));
            }
        }
        else {
            const user = yield db_1.default.user.findUnique({
                where: {
                    id: decoded.id,
                },
                include: {
                    legal_info: true,
                },
            });
            if (!user) {
                return next(new ErrorHandler_1.default("Please login to access this resource", 401));
            }
            req.user = user;
            next();
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default("Access token is not valid", 401));
    }
}));
exports.isAuthenticatedAdminstrator = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const access_token = req.cookies.access_token || "";
        if (!access_token) {
            return next(new ErrorHandler_1.default("Please login to access this resource", 401));
        }
        const decoded = jsonwebtoken_1.default.decode(access_token);
        if (!decoded) {
            return next(new ErrorHandler_1.default("access token is not valid", 401));
        }
        if (decoded.exp && decoded.exp <= Date.now() / 1000) {
            try {
                yield (0, createToken_1.updateAccessTokenAdministrator)(req, res, next);
                if (res.headersSent)
                    return; // Ensure no further response is sent after this
            }
            catch (error) {
                return next(new ErrorHandler_1.default("Please login to access this resource", 401));
            }
        }
        else {
            const adminstrator = yield db_1.default.administration.findUnique({
                where: {
                    id: decoded.id,
                },
            });
            if (!adminstrator) {
                return next(new ErrorHandler_1.default("Please login to access this resource", 401));
            }
            req.adminstrator = adminstrator;
            next();
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default("Access token is not valid", 401));
    }
}));
// check if the user is adminstrator
const isAdministrator = (...roles) => {
    return (req, res, next) => {
        if (!req.adminstrator) {
            return next(new ErrorHandler_1.default("Please login to access this resource", 401));
        }
        if (!roles.includes(req.adminstrator.role)) {
            return next(new ErrorHandler_1.default("You are not authorized to access this resource", 403));
        }
        next();
    };
};
exports.isAdministrator = isAdministrator;
