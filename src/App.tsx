import Main from "./components/Main";
import MainMenu from "./components/MainMenu";
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import React, { useState } from "react";

export type PageName = "main" | "game" | "login" | "register";

function App() {
  const [page, setPage] = useState<PageName>("main");

  const pages: Record<PageName, React.ReactNode> = {
    main: <MainMenu setPage={setPage} />,
    game: <Main />,
    login: <Login setPage={setPage} />,
    register: <Register setPage={setPage} />,
  };

  return (
    <div className="flex flex-col items-center bg-pink-50 w-full h-screen">
      <Header setPage={setPage} />
      {pages[page] || <div>Error: Page not found</div>}
    </div>
  );
}

export default App;
