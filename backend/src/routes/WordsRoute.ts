import { Router } from "express";
import { DataSource } from "typeorm";
import { Words } from "../entity/Words";
import { authenticateFirebaseToken, FirebaseRequest } from "../middleware/auth";
import { firebaseAdmin } from "../index";

const router = Router();

export function createWordsRouter(dataSource: DataSource) {
  router.get("/get-word", async (req, res) => {
    const { length, difficulty, category, language } = req.query;

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

        console.log("length", length);
      }

      if (category && category !== "all") {
        query = query.andWhere("words.category = :category", {
          category: category.toString().toLowerCase(),
        });

        console.log("category", category);
      }

      if (difficulty) {
        query = query.andWhere("words.difficulty = :difficulty", {
          difficulty: parseInt(difficulty as string, 10),
        });

        console.log("difficulty", difficulty);
      }

      if (language) {
        query = query.andWhere("words.language = :language", {
          language: language.toString().toUpperCase(),
        });

        console.log("language", language);
      }

      const randomWord = await query.getOne();

      if (randomWord) {
        res.json(randomWord);
      } else res.status(400).json({ error: "No words found" });
    } catch (error) {
      res.status(500).json({ error: "Error fetching words" });
    }
  });

  router.post(
    "/upload-words",
    authenticateFirebaseToken,
    async (req: FirebaseRequest, res) => {
      const { words } = req.body;

      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      try {
        const userDoc = await firebaseAdmin
          .firestore()
          .collection("users")
          .doc(req.user.uid)
          .get();

        if (!userDoc.exists) {
          return res.status(401).json({ error: "Unauthorized" });
        }

        if (!userDoc.data()?.admin) {
          return res.status(403).json({ error: "Forbidden" });
        }
      } catch (error) {
        return res.status(500).json({ error: "Error uploading words" });
      }

      if (!words) {
        return res.status(400).json({ error: "No words provided" });
      }

      try {
        const wordRepo = dataSource.getRepository(Words);

        for (const wordData of words) {
          const { word, category, description, language, difficulty } =
            wordData as Words;

          const length = word.length;

          // Validate that all required fields are present
          if (
            !word ||
            !length ||
            !category ||
            !description ||
            !language ||
            !difficulty
          ) {
            return res
              .status(400)
              .json({ error: "Missing required fields in word data" });
          }

          // Check if word already exists
          const existingWord = await wordRepo.find({
            where: {
              word: word,
            },
          });

          if (!existingWord) {
            await wordRepo.save({
              word,
              length,
              category,
              description,
              language,
              difficulty,
            });
          } else {
            console.log("Skipping existing word", word);
          }
        }

        return res
          .status(200)
          .json({ message: `words from server upload words ${words}` });
      } catch (error) {
        return res.status(500).json({ error: "Error uploading words" });
      }
    },
  );

  return router;
}
