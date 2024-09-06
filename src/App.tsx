import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import { lazy, Suspense } from "react";
import AdminRoute from "./components/Routes/AdminRoute";

const Main = lazy(() => import("./components/Main"));
const MainMenu = lazy(() => import("./components/MainMenu"));
const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));
const AdminPage = lazy(() => import("./components/AdminPage"));

function App() {
  return (
    <Router>
      <div className="flex flex-col items-center bg-pink-50 w-full h-screen">
        <Header />
        <Suspense fallback={<div>Laster inn...</div>}>
          <Routes>
            <Route path="/" element={<MainMenu />} />
            <Route path="/game" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/upload" element={<div>Upload</div>} />
            </Route>

            <Route path="*" element={<MainMenu />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
