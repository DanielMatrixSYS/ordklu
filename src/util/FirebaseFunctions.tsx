import { db } from "./FirebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

interface RandomWordProps {
  length: number;
  category: string;
}

export const getRandomWord = async ({
  length,
  category,
}: RandomWordProps): Promise<string> => {
  const wordRef = collection(db, "words");
  const wordQuery = query(
    wordRef,
    where("category", "==", category),
    where("length", "==", length),
  );
  const wordSnapshot = await getDocs(wordQuery);
  const words: string[] = [];

  wordSnapshot.forEach((doc) => {
    words.push(doc.data().word);
  });

  return words[Math.floor(Math.random() * words.length)];
};
