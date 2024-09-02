import * as fs from "fs";
import * as dotenv from "dotenv";
import "reflect-metadata";
import express from "express";
import cors from "cors";
import { DataSource } from "typeorm";
import { Words } from "./entity/Words";
import { createWordsRouter } from "./routes/WordsRoute";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const dataSource = new DataSource({
  type: "postgres",
  host: `https://${process.env.DATABASE_HOST ?? "localhost"}`,
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

  app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Server running on port ${process.env.PORT ?? 3000}`);
  });
});
