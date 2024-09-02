import * as fs from "fs";
import * as dotenv from "dotenv";
import "reflect-metadata";
import express from "express";
import cors from "cors";
import { DataSource } from "typeorm";
import { Words } from "./entity/Words";
import { createWordsRouter } from "./routes/WordsRoute";
import https from "https";
import http from "node:http";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const dataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST ?? "localhost",
  port: parseInt(process.env.DATABASE_PORT ?? "5432", 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DB,
  synchronize: true,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync(process.env.DATABASE_CERT_PATH ?? "").toString(),
  },
  entities: [Words],
});

dataSource.initialize().then(() => {
  app.use("/api/v1", createWordsRouter(dataSource));

  const httpsOptions = {
    key: fs.readFileSync("/etc/letsencrypt/live/api.ordklu.no/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/api.ordklu.no/fullchain.pem"),
  };

  https.createServer(httpsOptions, app).listen(443, () => {
    console.log("HTTPS Server running on port 443");
  });

  // Redirect
  http
    .createServer((req, res) => {
      res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
      res.end();
    })
    .listen(80, () => {
      console.log("HTTP Server running on port 80 and redirecting to HTTPS");
    });
});
