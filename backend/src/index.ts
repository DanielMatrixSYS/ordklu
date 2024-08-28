import * as fs from "fs";
import * as dotenv from "dotenv";
import "reflect-metadata";
import express from "express";
import cors from "cors";
import { DataSource } from "typeorm";
import { Words } from "./entity/Words";

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

dataSource
  .initialize()
  .then(() => {
    app.get("/random-word", async (req, res) => {
      try {
        const wordRepository = dataSource.getRepository(Words);

        const randomWord = await wordRepository
          .createQueryBuilder("words")
          .orderBy("RANDOM()")
          .limit(1)
          .getOne();

        if (randomWord) {
          res.json(randomWord);
        } else {
          res.status(404).json({ error: "No words found" });
        }
      } catch (error) {
        res.status(500).json({ error: "Error fetching words" });
      }
    });

    app.listen(process.env.SERVER_PORT, () => {
      console.log(
        `Good morning cocksuckermotherfucker. Port: ${process.env.SERVER_PORT}`,
      );
    });
  })
  .catch((error) => {
    console.error(error);
  });
