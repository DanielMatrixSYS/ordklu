import * as fs from "fs";
import * as dotenv from "dotenv";
import * as admin from "firebase-admin";
import "reflect-metadata";
import express from "express";
import cors from "cors";
import { DataSource } from "typeorm";
import { Words } from "./entity/Words";
//import { Users } from "./entity/Users";
import { createWordsRouter } from "./routes/WordsRoute";
import http from "http";
import crypto from "crypto";
import rateLimit from "express-rate-limit";

dotenv.config();

export const firebaseAdmin = admin.apps.length
  ? admin.app()
  : admin.initializeApp({
      credential: admin.credential.cert(process.env.SERVICEACCOUNT ?? ""),
    });

const app = express();

app.use((req, res, next) => {
  const nonce = crypto
    .randomBytes(16)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  res.setHeader(
    "Content-Security-Policy",
    `default-src 'self'; script-src 'self' 'nonce-${nonce}' https://apis.google.com; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://ordklu.no https://api.ordklu.no https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://www.googleapis.com; frame-src 'self' https://ordklu.firebaseapp.com https://www.google.com; img-src 'self' https://google.com`,
  );

  res.locals.nonce = nonce;
  next();
});

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    allowedHeaders: ["Origin", "Content-Type", "Accept", "Authorization"],
    credentials: false,
  }),
);

app.use(express.json());

const dataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST ?? "localhost",
  port: parseInt(process.env.DATABASE_PORT ?? "5432", 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DB,
  synchronize: false,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync(process.env.DATABASE_CERT_PATH ?? "").toString(),
  },
  entities: [Words],
});

dataSource.initialize().then(() => {
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: "Too many requests from this IP, please try again later",
  });

  app.use("/v1", apiLimiter);
  app.use("/v1", createWordsRouter(dataSource));

  // HTTP
  // Nginx will handle HTTPS
  http.createServer(app).listen(3001, () => {
    console.log("Server running on port 3001 (nginx proxy)");
  });
});
