import React, { useEffect, useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { PageName } from "../App.tsx";
import {
  firebaseAuthErrorDetails,
  FirebaseAuthErrorCode,
} from "./Auth/AuthErrorHandling.tsx";
import Button from "./Button.tsx";
import AltButton from "./AltButton.tsx";

const Login: React.FC<{ setPage: (page: PageName) => void }> = ({
  setPage,
}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (error) {
      const timeoutId = setTimeout(() => {
        setError("");
      }, 5000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [error]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setLoading(false);

        const user = userCredential.user;
        console.log("User logged in: ", user?.displayName || "Anonymous");
        setPage("main");
      })
      .catch((error) => {
        const errorCode = error.code as FirebaseAuthErrorCode;

        if (errorCode in firebaseAuthErrorDetails) {
          const details = firebaseAuthErrorDetails[errorCode];

          setError(details.description);
        }
      });

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center mt-10 h-screen">
      <div className="flex flex-col items-center justify-center p-4 py-16 rounded-lg">
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            Ordklu
          </h1>

          <p className="text-lg text-neutral-700">
            Logg inn eller registrer deg for å beholde progresjonen
          </p>
        </div>
        <form className="flex flex-col w-full space-y-2" onSubmit={onSubmit}>
          <input
            type="email"
            placeholder="E-post"
            className="p-2 border border-neutral-400 text-sm focus:outline-none rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Passord"
            className="p-2 border border-neutral-400 text-sm focus:outline-none rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <Button
            value="Logg inn"
            type="submit"
            disabled={loading}
            loading={loading}
          />
        </form>

        <p className="text-sm/8 text-neutral-700 mt-1 hover:cursor-pointer hover:text-blue-700 hover:underline">
          Glemt passordet?
        </p>

        <AltButton
          value="Registrer deg"
          onClick={() => setPage("register")}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default Login;
