import { db } from "./FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { auth } from "./FirebaseConfig";
import { UserCredential } from "firebase/auth";

interface UserProps {
  username: string;
  email: string;
  password: string;
}

import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import {
  FirebaseAuthErrorCode,
  firebaseAuthErrorDetails,
} from "../components/Auth/AuthErrorHandling.tsx";

type RandomWordProps = {
  length: number;
  category: string;
};

export const addSolvedWord = async (word: string): Promise<void> => {
  const auth = getAuth();
  const uid = auth.currentUser?.uid;

  if (!uid) {
    const solvedWords = JSON.parse(
      sessionStorage.getItem("solvedWords") || "[]",
    ) as string[];

    solvedWords.push(word);

    sessionStorage.setItem("solvedWords", JSON.stringify(solvedWords));

    return;
  }

  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(doc(db, "users", uid), {
        solved: [word],
        totalSolved: 1,
      });

      return;
    }

    const solvedWords = docSnap.data().solved;
    solvedWords.push(word);

    await setDoc(docRef, {
      solved: solvedWords,
      totalSolved: solvedWords.length,
    });

    return;
  } catch (error) {
    console.error(error);
  }

  return;
};

const getSolvedWords = async (): Promise<string[]> => {
  const auth = getAuth();
  const uid = auth.currentUser?.uid;

  if (!uid) {
    return JSON.parse(
      sessionStorage.getItem("solvedWords") || "[]",
    ) as string[];
  }

  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return [];
    }

    return docSnap.data().solved;
  } catch (error) {
    console.error(error);
  }

  return [];
};

/*const getTotalSolvedWords = async (): Promise<number> => {
  const auth = getAuth();
  const uid = auth.currentUser?.uid;

  if (!uid) {
    const words = JSON.parse(sessionStorage.getItem("solvedWords") || "[]");
    return words.length || 0;
  }

  try {
    const docs = await getDocs(collection(db, "users", uid));

    if (docs.empty) {
      return 0;
    }

    return docs.docs[0].data().totalSolved;
  } catch (error) {
    console.error(error);
  }

  return 0;
};*/

const fetchRandomWord = async (
  category: string,
  length: number,
): Promise<string> => {
  const wordRef = collection(db, "words");
  const solvedWords = await getSolvedWords();

  let wordQuery;

  if (solvedWords.length === 0) {
    wordQuery = query(
      wordRef,
      where("category", "==", category),
      where("length", "==", length),
      orderBy("word"),
      limit(1),
    );
  } else {
    wordQuery = query(
      wordRef,
      where("category", "==", category),
      where("length", "==", length),
      where("word", "not-in", solvedWords),
      orderBy("word"),
      limit(1),
    );
  }

  const wordsSnapshot = await getDocs(wordQuery);

  if (wordsSnapshot.empty) {
    throw new Error("No words available in the database.");
  }

  return wordsSnapshot.docs[0].data().word;
};

export const getRandomWord = async ({
  length,
  category,
}: RandomWordProps): Promise<string> => {
  console.log("Fetching a random word");

  const randomWord = await fetchRandomWord(category, length);

  console.log("Random word fetched:", randomWord);

  return randomWord;
};

export const usernameExists = async (username: string): Promise<boolean> => {
  try {
    console.log("Checking if username exists");
    const userRef = collection(db, "users");
    const userQuery = query(userRef, where("username", "==", username));
    const userSnapshot = await getDocs(userQuery);

    console.log("User exists:", !userSnapshot.empty);

    return !userSnapshot.empty;
  } catch (error) {
    console.error(error);
  }

  return true;
};

export const registerUser = async ({
  username,
  email,
  password,
}: UserProps): Promise<[boolean, string]> => {
  /*if (await usernameExists(username)) {
    console.log("Username already exists");

    return false;
  }*/

  console.log("Creating user");

  let errorDescription: string = "Uventet feil. Vennligst prøv igjen senere.";

  await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential: UserCredential) => {
      updateProfile(userCredential.user, {
        displayName: username,
      });

      console.log("Profile updated");

      // Create a user document in the database
      const userRef = doc(db, "users", userCredential.user.uid);
      setDoc(userRef, {
        username,
        email,
        uid: userCredential.user.uid,
      });

      return [true, ""];
    })
    .catch((error) => {
      const errorCode = error.code as FirebaseAuthErrorCode;

      if (errorCode in firebaseAuthErrorDetails) {
        const details = firebaseAuthErrorDetails[errorCode];

        errorDescription = details.description;
      }
    });

  return [false, errorDescription];
};
