import { useContext, useState } from "react";
import { GoSidebarCollapse } from "react-icons/go";
import Sidebar from "./Sidebar.tsx";
import { AuthContext, AuthContextProps } from "./Auth/AuthContext.tsx";
import { FaSpinner } from "react-icons/fa";

const Header = () => {
  //const [timeUsed, setTimeUsed] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const { user, loading } = useContext(AuthContext) as AuthContextProps;

  /*useEffect(() => {
    const interval = setInterval(() => {
      setTimeUsed((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    setTimeUsed(0);
  }, [user]);*/

  return (
    <div className="w-full">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="w-full px-2 h-[45.5px] border-b border-b-neutral-300 bg-pink-50">
        <div className="flex w-full h-full items-center justify-between">
          <div className="flex items-center">
            <button
              className={`${sidebarOpen ? "hidden" : "text-neutral-700"}`}
              onClick={() => setSidebarOpen((prev) => !prev)}
            >
              <GoSidebarCollapse />
            </button>
          </div>

          <div className="flex space-x-2">
            <div className="text-neutral-700 text-sm/8 md:text-base/8">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <span className="text-neutral-700">Laster inn...</span>
                  <span className="text-neutral-700">
                    <FaSpinner className="animate-spin" />
                  </span>
                </div>
              ) : user ? (
                user.displayName
              ) : (
                "Ikke logget inn"
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
