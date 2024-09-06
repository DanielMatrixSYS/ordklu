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
  getDocs,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import {
  FirebaseAuthErrorCode,
  firebaseAuthErrorDetails,
} from "../components/Auth/AuthErrorHandling.tsx";

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

export const usernameExists = async (username: string): Promise<boolean> => {
  try {
    const userRef = collection(db, "users");
    const userQuery = query(userRef, where("username", "==", username));
    const userSnapshot = await getDocs(userQuery);

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
