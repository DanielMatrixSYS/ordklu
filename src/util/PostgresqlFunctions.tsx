import axios from "axios";

export const fetchRandomWord = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/${import.meta.env.VITE_SERVER_APIVERSION}/get-word?length=5&category=all`,
    );

    if (response.status === 200) {
      if (response.data.word) {
        return response.data.word;
      } else return "";
    } else {
      return "";
    }
  } catch (error) {
    console.error(error);
  }
};
