import { GoSidebarExpand } from "react-icons/go";
import React from "react";

import Button from "./Button";

const Sidebar: React.FC<{
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}> = ({ sidebarOpen, setSidebarOpen }) => {
  const buttons = ["Start", "Stopp", "Nullstill"];

  return (
    <div
      className={`fixed left-0 w-2/3 h-full z-50 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } backdrop-blur-lg bg-black/20 border border-white/70 shadow-2xl`}
    >
      <div className="flex items-center justify-between p-2">
        <button
          className="text-neutral-700"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <GoSidebarExpand />
        </button>

        <p className="text-neutral-700 text-lg md:text-2xl">Kontrollpanel</p>
      </div>

      <hr className="border-neutral-400" />

      <div className="flex flex-col space-y-2 p-2">
        {buttons.map((name: string, i: number) => (
          <Button value={name} key={i} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
