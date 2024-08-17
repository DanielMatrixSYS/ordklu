import { db } from "./FirebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "./FirebaseConfig";
import { UserCredential } from "firebase/auth";

interface RandomWordProps {
  length: number;
  category: string;
}

interface UserProps {
  username: string;
  email: string;
  password: string;
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
}: UserProps): Promise<boolean> => {
  /*if (await usernameExists(username)) {
    console.log("Username already exists");

    return false;
  }*/

  console.log("Creating user");

  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    console.log("User created");

    await updateProfile(userCredential.user, {
      displayName: username,
    });

    console.log("Profile updated");

    // Create a user document in the database
    const userRef = doc(db, "users", userCredential.user.uid);
    await setDoc(userRef, {
      username,
      email,
      uid: userCredential.user.uid,
    });

    console.log("User document created");

    return true;
  } catch (error) {
    console.error(error);
  }

  return false;
};
