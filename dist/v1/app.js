"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_1 = __importDefault(require("./middleware/error"));
const ErrorHandler_1 = __importDefault(require("./middleware/ErrorHandler"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const express_useragent_1 = __importDefault(require("express-useragent"));
const request_ip_1 = __importStar(require("request-ip"));
const checkVPN_1 = __importDefault(require("./utils/checkVPN"));
require("./utils/scheduler");
const express_static_cache_1 = __importDefault(require("express-static-cache"));
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
// impoer routes
const adminstrator_route_1 = __importDefault(require("./routes/adminstrator.route"));
const categorie_route_1 = __importDefault(require("./routes/categorie.route"));
const product_route_1 = __importDefault(require("./routes/product.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const contract_route_1 = __importDefault(require("./routes/contract.route"));
const payment_route_1 = __importDefault(require("./routes/payment.route"));
const analytic_route_1 = __importDefault(require("./routes/analytic.route"));
const messages_route_1 = __importDefault(require("./routes/messages.route"));
const contact_route_1 = __importDefault(require("./routes/contact.route"));
// swagger api docs config
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "API Docs",
            version: "1.0.0",
            description: "API Docs",
        },
        servers: [
            {
                url: "https://5jiek.uz",
                description: "Production server",
            },
        ],
    },
    apis: ['./src/v1/docs/*.docs.ts'], // Correct path to the docs folder
};
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
// middlewars
const limiter = new rate_limiter_flexible_1.RateLimiterMemory({
    points: 100, // maximum number of requests
    duration: 1 // 1 seconds
});
// Rate limiter middleware should be applied after static files to exclude them
app.use((req, res, next) => {
    if (req.path.startsWith('/public')) {
        next();
    }
    else {
        limiter
            .consume(req.ip)
            .then(() => {
            next();
        })
            .catch(() => {
            res.status(429).send("Too Many Requests");
        });
    }
});
app.use((0, cors_1.default)({
    origin: (_a = process.env.CLIENT_URL) === null || _a === void 0 ? void 0 : _a.split(","),
    credentials: true
}));
app.use((0, helmet_1.default)());
app.set('trust proxy', true);
app.use(checkVPN_1.default);
app.use(express_useragent_1.default.express());
app.use(request_ip_1.default.mw());
app.use((0, compression_1.default)());
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
app.use((0, morgan_1.default)(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.disable('x-powered-by');
// static files
app.use("/public", (req, res, next) => {
    res.header("Cross-Origin-Resource-Policy", "cross-origin");
    next();
}, (0, express_static_cache_1.default)(path_1.default.join(__dirname, '../../public'), {
    maxAge: 86400, // Cache duration in seconds (e.g., one day)
    cacheControl: true
}), express_1.default.static(path_1.default.join(__dirname, "../../public"))); // Check this path
// routes
app.use("/api/v1/adminstrator", adminstrator_route_1.default);
app.use("/api/v1/categorie", categorie_route_1.default);
app.use("/api/v1/product", product_route_1.default);
app.use("/api/v1/user", user_route_1.default);
app.use("/api/v1/contract", contract_route_1.default);
app.use("/api/v1/payments", payment_route_1.default);
app.use("/api/v1/analytics", analytic_route_1.default);
app.use("/api/v1/messages", messages_route_1.default);
app.use("/api/v1/contacts", contact_route_1.default);
app.get("/", (req, res) => {
    const ip = (0, request_ip_1.getClientIp)(req);
    res.send(`Welcome to Express & TypeScript Server ${ip}`);
});
// 404 error handling
app.all("*", (req, res, next) => {
    const error = new ErrorHandler_1.default(`Route ${req.originalUrl} not found!`, 404);
    res.status(error.statusCode).json({
        success: false,
        message: error.message,
    });
});
// error handling middleware
app.use(error_1.default);
exports.default = app;
