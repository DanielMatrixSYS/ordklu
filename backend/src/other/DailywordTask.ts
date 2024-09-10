import cron from "node-cron";
import { dataSource } from "../index";
import { Words } from "../entity/Words";

export async function updateDailyWord() {
  try {
    const updatedData = await dataSource
      .createQueryBuilder()
      .update(Words)
      .set({ daily: false })
      .where("daily = true")
      .returning("id")
      .execute();

    const wordRepo = dataSource.getRepository(Words);

    let query = wordRepo
      .createQueryBuilder("words")
      .orderBy("RANDOM()")
      .limit(1);

    if (updatedData.raw.length > 0) {
      query = query.andWhere("words.id != :id", {
        id: updatedData.raw[0].id,
      });
    }

    const newDailyWord = await query.getOne();

    if (newDailyWord) {
      await wordRepo.update(newDailyWord, { daily: true });

      console.log("New daily word:", newDailyWord);
    }

    console.log("Daily word updated successfully!");
  } catch (error) {
    console.error("Error updating the daily word:", error);
  }
}

export function dailyWordTask() {
  cron.schedule("0 0 * * *", updateDailyWord);
}
