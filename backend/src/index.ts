import * as fs from "fs";
import * as dotenv from "dotenv";
import "reflect-metadata";
import express from "express";
import cors from "cors";
import { DataSource } from "typeorm";
import { Words } from "./entity/Words";
import { createWordsRouter } from "./routes/WordsRoute";
import https from "https";

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
  app.use("/v1", createWordsRouter(dataSource));

  const httpsOptions = {
    key: fs.readFileSync("/etc/letsencrypt/live/api.ordklu.no/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/api.ordklu.no/fullchain.pem"),
  };

  https.createServer(httpsOptions, app).listen(process.env.PORT ?? 443, () => {
    console.log(`HTTPS mothafucka running on port ${process.env.PORT ?? 443}`);
  });
});
