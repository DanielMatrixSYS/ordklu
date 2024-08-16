import React from "react";

import { PageName } from "../App.tsx";

const Login: React.FC<{ setPage: (page: PageName) => void }> = ({
  setPage,
}) => {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted");
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
            type="text"
            placeholder="E-post"
            className="p-2 border border-neutral-400 text-sm focus:outline-none rounded-md"
          />

          <input
            type="password"
            placeholder="Passord"
            className="p-2 border border-neutral-400 text-sm focus:outline-none rounded-md"
          />

          <button
            type="submit"
            className="p-2 bg-blue-700 text-sm font-light text-white rounded-full active:bg-blue-800"
          >
            Logg inn
          </button>
        </form>

        <p className="text-sm/8 text-neutral-700 mt-1 hover:cursor-pointer hover:text-blue-700 hover:underline">
          Glemt passordet?
        </p>

        <button
          className="p-2 mt-8 border border-blue-700 text-sm w-full text-blue-700 active:bg-blue-300 rounded-full"
          onClick={() => setPage("register")}
        >
          Opprett ny konto
        </button>
      </div>
    </div>
  );
};

export default Login;
