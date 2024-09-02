import { Router } from "express";
import { DataSource } from "typeorm";
import { Words } from "../entity/Words";

const router = Router();

export function createWordsRouter(dataSource: DataSource) {
  router.get("/get-word", async (req, res) => {
    const { length, category } = req.query;

    try {
      const wordRepo = dataSource.getRepository(Words);

      let query = wordRepo
        .createQueryBuilder("words")
        .orderBy("RANDOM()")
        .limit(1);

      if (length) {
        query = query.andWhere("LENGTH(words.word) = :length", {
          length: parseInt(length as string, 10),
        });
      }

      if (category && category !== "all") {
        query = query.andWhere("words.category = :category", {
          category: category as string,
        });
      }

      const randomWord = await query.getOne();

      if (randomWord) {
        res.json(randomWord);
      } else res.status(400).json({ error: "No words found" });
    } catch (error) {
      res.status(500).json({ error: "Error fetching words" });
    }
  });

  return router;
}
