import axios from "axios";
import { RetrievedWordInterface } from "./Other.tsx";

const defaultWord: RetrievedWordInterface = {
  id: 0,
  length: 5,
  category: "all",
  description: "",
  difficulty: 1,
  word: "TREGT",
  language: "NO",
};

export const fetchDailyWord = async (): Promise<RetrievedWordInterface> => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/${import.meta.env.VITE_SERVER_APIVERSION}/words/get/daily`,
    );

    if (response.status === 200 && response.data) {
      return response.data as RetrievedWordInterface;
    }
  } catch (error) {
    console.error("Error fetching daily word:", error);
  }

  return defaultWord;
};

export const fetchCustomWord = async (
  length: number = 5,
  difficulty: number = 1,
  category: string = "all",
  language: string = "NO",
): Promise<RetrievedWordInterface> => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/${import.meta.env.VITE_SERVER_APIVERSION}/words/get/custom`,
      {
        params: {
          length,
          difficulty,
          category,
          language,
        },
      },
    );

    if (response.status === 200 && response.data) {
      return response.data as RetrievedWordInterface;
    }
  } catch (error) {
    console.error("Error fetching random word:", error);
  }

  return defaultWord;
};

export const wordExists = async (word: string): Promise<boolean> => {
  if (!word || word === "") {
    console.log("No word provided");
    return false;
  }

  word = word.toLowerCase();

  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/${import.meta.env.VITE_SERVER_APIVERSION}/words/exists`,
      {
        params: {
          word,
        },
      },
    );

    if (response.status === 200 && response.data) {
      return response.data as boolean;
    }
  } catch (error) {
    console.error("Error checking if word exists:", error);
  }

  return false;
};
