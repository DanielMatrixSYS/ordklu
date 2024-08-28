import { GoSidebarExpand } from "react-icons/go";
import React, { useContext, useMemo } from "react";
import { PageName } from "../App.tsx";
import SidebarButton from "./SidebarButton.tsx";
import { AuthContext, AuthContextProps } from "./Auth/AuthContext.tsx";
import { getAuth, signOut } from "firebase/auth";

type ActionType = "Lukk" | "Logout";
type PageType = PageName;

type SidebarAction = ActionType | PageType;

interface SidebarButton {
  name: string;
  action: SidebarAction;
}

const Sidebar: React.FC<{
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setPage: (page: PageName) => void;
}> = ({ sidebarOpen, setSidebarOpen, setPage }) => {
  const { user } = useContext(AuthContext) as AuthContextProps;

  const sidebarButtons = useMemo<SidebarButton[]>(() => {
    const buttons: SidebarButton[] = [
      { name: "Hjem", action: "main" },
      { name: "Spill", action: "game" },
    ];

    if (user) {
      buttons.push(
        { name: "Profil", action: "profile" },
        { name: "Logout", action: "Logout" },
      );
    } else {
      buttons.push({ name: "Logg inn", action: "login" });
    }

    buttons.push({ name: "Lukk", action: "Lukk" });

    return buttons;
  }, [user]);

  const handleButtonClick = (action: SidebarAction) => {
    if (action === "Lukk") {
      setSidebarOpen(false);

      return;
    }

    if (action === "Logout") {
      const auth = getAuth();

      signOut(auth)
        .then(() => {
          console.log("Signed out");
        })
        .catch((error) => {
          console.log("Error signing out: ", error);
        });

      return;
    }

    setPage(action);
    setSidebarOpen(false);
  };

  return (
    <div
      className={`fixed w-2/3 sm:w-1/4 h-full z-50 transform transition-transform duration-300 ease-in-out ${
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
        {sidebarButtons.map((button, index) => (
          <SidebarButton
            key={index}
            value={button.name}
            onClick={() => handleButtonClick(button.action)}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
