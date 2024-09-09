import axios from "axios";
import { RetrievedWordInterface } from "./Other.tsx";

const defaultWord: RetrievedWordInterface = {
  id: 0,
  length: 5,
  category: "all",
  description: "",
  difficulty: 1,
  word: "",
  language: "no",
};

export const fetchRandomWord = async (
  length: number = 5,
  difficulty: number = 1,
  category: string = "all",
  language: string = "no",
): Promise<RetrievedWordInterface> => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/${import.meta.env.VITE_SERVER_APIVERSION}/get-word`,
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
