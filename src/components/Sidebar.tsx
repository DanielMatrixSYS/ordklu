import { GoSidebarExpand } from "react-icons/go";
import React, { useContext, useMemo } from "react";
import SidebarButton from "./SidebarButton.tsx";
import { AuthContext, AuthContextProps } from "./Auth/AuthContext.tsx";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

type ActionType =
  | "Lukk"
  | "Logout"
  | "/"
  | "/game"
  | "/profile"
  | "/login"
  | "/admin";

interface SidebarButton {
  name: string;
  action: ActionType;
  redirect: boolean;
}

const Sidebar: React.FC<{
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}> = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, userProfile } = useContext(AuthContext) as AuthContextProps;
  const navigate = useNavigate();

  const sidebarButtons = useMemo<SidebarButton[]>(() => {
    const buttons: SidebarButton[] = [
      { name: "Hjem", action: "/", redirect: true },
      { name: "Spill", action: "/game", redirect: true },
    ];

    if (user) {
      buttons.push(
        { name: "Profil", action: "/profile", redirect: true },
        { name: "Logout", action: "Logout", redirect: false },
      );

      if (userProfile?.admin) {
        buttons.push({ name: "Admin", action: "/admin", redirect: true });
      }
    } else {
      buttons.push({ name: "Logg inn", action: "/login", redirect: true });
    }

    buttons.push({ name: "Lukk", action: "Lukk", redirect: false });

    return buttons;
  }, [user, userProfile]);

  const handleButtonClick = (action: ActionType) => {
    if (action.includes("/")) {
      navigate(action);

      setSidebarOpen(false);
      return;
    }

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

      setSidebarOpen(false);
      return;
    }

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

      <div className="absolute flex flex-col items-center bottom-0">
        {user && userProfile && (
          <div className="flex flex-col p-2">
            <p className="text-neutral-700 text-sm">{user.displayName}</p>
            <p className="text-neutral-700 text-sm">
              {user.uid.substring(user.uid.length - 5)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
