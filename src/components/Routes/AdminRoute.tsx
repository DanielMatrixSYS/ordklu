import { AuthContext, AuthContextProps } from "../Auth/AuthContext.tsx";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../Loader.tsx";

const AdminRoute = () => {
  const { user, userProfile, loading } = useContext(
    AuthContext,
  ) as AuthContextProps;

  if (loading)
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Loader text={"Venter på data..."} />
      </div>
    );

  if (!user) return <Navigate to="/login" />;
  if (!userProfile) return <Navigate to="/login" />;
  if (!userProfile?.admin) return <Navigate to="/" />;

  return <Outlet />;
};

export default AdminRoute;
