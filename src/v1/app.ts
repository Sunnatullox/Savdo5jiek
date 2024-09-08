import express, { Request, Response, Application, NextFunction } from "express";
const app: Application = express();
import helmet from "helmet";
import cors from "cors";
import { RateLimiterMemory } from "rate-limiter-flexible";
import compression from "compression";
import cookieParser from "cookie-parser";
import ErrorHandlerMiddleware from "./middleware/error";
import ErrorHandler from "./middleware/ErrorHandler";
import path from "path";
import morgan from "morgan";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import useragent from "express-useragent";
import requestIp, { getClientIp } from "request-ip";
import checkVPN from "./utils/checkVPN";
import "./utils/scheduler";
import expressStaticCache from 'express-static-cache';

// impoer routes
import adminstratorRoutes from "./routes/adminstrator.route";
import categorieRoutes from "./routes/categorie.route";
import productRoutes from "./routes/product.route";
import userRoutes from "./routes/user.route";
import contractRoutes from "./routes/contract.route";
import paymentRoutes from "./routes/payment.route";
import analyticsRoutes from "./routes/analytic.route";
import messagesRoutes from "./routes/messages.route";
import contactsRoutes from "./routes/contact.route";

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
        url: "http://localhost:5500",
        description: "Local server",
      },
      {
        url: "https://5jiek.uz",
        description: "Production server",
      },
      {
        url: "http://176.124.210.180",
        description: "Server",
      },
    ],
  },
  apis: ['./src/v1/docs/*.docs.ts'], // Correct path to the docs folder
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// middlewars
app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(","),
    credentials: true
  })
);
const rateLimiter = new RateLimiterMemory({
  points: 100, // 100 requests
  duration: 60, // per 1 second by IP
});
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/public')) {
    next(); 
  } else {
    rateLimiter
      .consume(req.ip as string)
      .then(() => {
        next();
      })
      .catch(() => {
        res.status(429).send("Too Many Requests");
      });
  }
});
app.use(helmet());
app.set('trust proxy', true)
app.use(checkVPN);
app.use(useragent.express());
app.use(requestIp.mw());
app.use(compression());
app.use(cookieParser(process.env.COOKIE_SECRET as string));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
// app.disable('x-powered-by');

// static files
app.use("/public",(req, res, next) => {
  res.header("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, expressStaticCache(path.join(__dirname, '../../public'), { // Check this path
  maxAge: 86400,  // Cache duration in seconds (e.g., one day)
  cacheControl: true
}), express.static(path.join(__dirname, "../../public"))); // Check this path

// routes
app.use("/api/v1/adminstrator", adminstratorRoutes);
app.use("/api/v1/categorie", categorieRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/contract", contractRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/messages", messagesRoutes);
app.use("/api/v1/contacts", contactsRoutes);


app.get("/", (req: Request, res: Response) => {
  const ip = getClientIp(req)
  res.send(`Welcome to Express & TypeScript Server ${ip}`)
});

// 404 error handling
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const error = new ErrorHandler(`Route ${req.originalUrl} not found!`, 404);
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
  });
});

// error handling middleware
app.use(ErrorHandlerMiddleware);

export default app;
