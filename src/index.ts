import dotenv from "dotenv";
import app from "./v1/app";
import https from "https";
import fs from "fs";
import prisma from "./v1/config/db";

//For env File
dotenv.config();

interface errorType {
  message: string;
}

const httpsOptions = {
  key: fs.readFileSync(
    "../security/ssl/d4847_53621_f278db9a2f7ff271522a264b04999576.key"
  ),
  cert: fs.readFileSync(
    "../security/ssl/www_api_savdo5jiek_uz_d4847_53621_1726801762_0d3fe2120c8623ccd9e920a6cea21f1f.crt"
  ),
};

// Handling uncaught Exception
process.on("uncaughtException", (err: errorType) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server for handling uncaught exception`);
});

https.createServer(httpsOptions, app).listen(443, () => {
  console.log("HTTPS server is running on port 443");
});

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);

  // Connect to the database
  prisma
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
process.on("unhandledRejection", (err: errorType) => {
  console.log(`Shutting down the server for ${err.message}`);
  console.log(`shutting down the server for unhandle promise rejection`);

  server.close(() => {
    console.log(`shutting down the server for unhandle promise rejection`);
    process.exit(1);
  });
});
