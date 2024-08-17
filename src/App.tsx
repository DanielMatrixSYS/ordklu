import Header from "./components/Header";
import { lazy, ReactNode, Suspense, useState } from "react";

const Main = lazy(() => import("./components/Main"));
const MainMenu = lazy(() => import("./components/MainMenu"));
const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));

export type PageName = "main" | "game" | "login" | "register" | "profile";

function App() {
  const [page, setPage] = useState<PageName>("main");

  const pages: Record<PageName, ReactNode> = {
    main: <MainMenu setPage={setPage} />,
    game: <Main />,
    login: <Login setPage={setPage} />,
    register: <Register setPage={setPage} />,
    profile: <MainMenu setPage={setPage} />,
  };

  return (
    <div className="flex flex-col items-center bg-pink-50 w-full h-screen">
      <Header setPage={setPage} />
      <Suspense fallback={<div>Laster inn...</div>}>
        {pages[page] || <div>Error: Page not found</div>}
      </Suspense>
    </div>
  );
}

export default App;
