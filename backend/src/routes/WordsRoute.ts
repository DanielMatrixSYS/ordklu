import { Router } from "express";
import { DataSource } from "typeorm";
import { Words } from "../entity/Words";
import { authenticateFirebaseToken, FirebaseRequest } from "../middleware/auth";
import { firebaseAdmin } from "../index";

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

      console.log("allowed to upload:", req.user?.uid);
      console.log(words);

      return res
        .status(200)
        .json({ message: `words from server upload words ${words}` });
    },
  );

  return router;
}
