import React, { useEffect, useState } from "react";
import { GoSidebarCollapse } from "react-icons/go";
import { formatTime } from "../util/Other";
import Sidebar from "./Sidebar.tsx";
import { PageName } from "../App.tsx";

const Header: React.FC<{ setPage: (page: PageName) => void }> = ({
  setPage,
}) => {
  const [timeUsed, setTimeUsed] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUsed((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-full">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setPage={setPage}
      />

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
            <p className="text-neutral-700 text-sm/8 md:text-base/8">
              Tid brukt: {formatTime(timeUsed)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
