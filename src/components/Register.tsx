import React, { useEffect, useState } from "react";
import { PageName } from "../App.tsx";
import { registerUser } from "../util/FirebaseFunctions.tsx";
import { FaSpinner } from "react-icons/fa";

const Register: React.FC<{ setPage: (page: PageName) => void }> = ({
  setPage,
}) => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const shouldContinue = (): [string, boolean] => {
    if (!username) {
      return ["Brukernavn kan ikke være tomt", false];
    }

    if (!email) {
      return ["E-post kan ikke være tomt", false];
    }

    if (!password) {
      return ["Passord kan ikke være tomt", false];
    }

    if (password.length < 6) {
      return ["Passordet må være minst 6 tegn langt", false];
    }

    if (username.length < 3) {
      return ["Brukernavnet må være minst 3 tegn langt", false];
    }

    if (!email.includes("@")) {
      return ["Ugyldig e-postadresse", false];
    }

    return ["", true];
  };

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

    console.log("Registering user: ", username, shouldContinue());

    const [reason, continuing] = shouldContinue();

    if (!continuing) {
      setError(reason);

      return;
    }

    setLoading(true);

    const [result, error] = await registerUser({ username, email, password });

    if (result) {
      setLoading(false);
      setPage("main");

      return;
    }

    setError(error);
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
            Registrer deg for å beholde progresjonen
          </p>
        </div>

        <form className="flex flex-col w-full space-y-2" onSubmit={onSubmit}>
          <input
            disabled={loading}
            value={username}
            type="text"
            placeholder="Brukernavn"
            className="p-2 border border-neutral-400 text-sm focus:outline-none rounded-md"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            disabled={loading}
            value={email}
            type="email"
            placeholder="E-post"
            className="p-2 border border-neutral-400 text-sm focus:outline-none rounded-md"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            disabled={loading}
            value={password}
            type="password"
            placeholder="Passord"
            className="p-2 border border-neutral-400 text-sm focus:outline-none rounded-md"
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            disabled={loading}
            type="submit"
            className="p-2 bg-blue-700 active:bg-blue-800 text-sm font-light text-white rounded-full"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <span className="text-neutral-100">Registrerer deg</span>
                <span className="text-neutral-100">
                  <FaSpinner className="animate-spin" />
                </span>
              </div>
            ) : (
              "Registrer deg"
            )}
          </button>
        </form>

        <p
          className="text-sm/8 text-neutral-700 mt-1 hover:cursor-pointer hover:text-blue-700 hover:underline"
          onClick={() => {
            setPage("login");
          }}
        >
          Jeg har allerede en konto
        </p>
      </div>
    </div>
  );
};

export default Register;
