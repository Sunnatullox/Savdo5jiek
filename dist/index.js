"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./v1/app"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const db_1 = __importDefault(require("./v1/config/db"));
//For env File
dotenv_1.default.config();
const httpsOptions = {
    key: fs_1.default.readFileSync("../security/ssl/d4847_53621_f278db9a2f7ff271522a264b04999576.key"),
    cert: fs_1.default.readFileSync("../security/ssl/www_api_savdo5jiek_uz_d4847_53621_1726801762_0d3fe2120c8623ccd9e920a6cea21f1f.crt"),
};
// Handling uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server for handling uncaught exception`);
});
https_1.default.createServer(httpsOptions, app_1.default).listen(443, () => {
    console.log("HTTPS server is running on port 443");
});
const port = process.env.PORT || 8000;
const server = app_1.default.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
    // Connect to the database
    db_1.default
        .$connect()
        .then(() => {
        console.log("Connected to the database");
    })
        .catch((error) => {
        console.error("Failed to connect to the database", error);
        process.exit(1);
    });
});
// unhandled promise rejection
process.on("unhandledRejection", (err) => {
    console.log(`Shutting down the server for ${err.message}`);
    console.log(`shutting down the server for unhandle promise rejection`);
    server.close(() => {
        console.log(`shutting down the server for unhandle promise rejection`);
        process.exit(1);
    });
});
