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
      .returning("*")
      .execute();

    /*const newDailyWord = await wordRepo
      .createQueryBuilder("words")
      .orderBy("RANDOM()")
      .where("words.word != :word", { word: currentDailyWord?.word })
      .getOne();

    if (newDailyWord) {
      await wordRepo.update(newDailyWord.id, { daily: true });
    }*/

    console.log("Updated data:", updatedData);

    console.log("Daily word updated successfully!");
  } catch (error) {
    console.error("Error updating the daily word:", error);
  }
}

export function dailyWordTask() {
  cron.schedule("0 0 * * *", updateDailyWord);
}
