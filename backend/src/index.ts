import * as fs from "fs";
import * as path from "path";
import "reflect-metadata";
import express from "express";
import cors from "cors";
import { DataSource } from "typeorm";
import { Words } from "./entity/Words";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const dataSource = new DataSource({
  type: "postgres",
  host: "",
  port: 5432,
  username: "",
  password: "",
  database: "",
  synchronize: true,
  ssl: {
    rejectUnauthorized: true,
    ca: fs
      .readFileSync(path.resolve(__dirname, "certs/eu-north-1-bundle.pem"))
      .toString(),
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

    app.listen(port, () => {
      console.log(`Server started. Listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
