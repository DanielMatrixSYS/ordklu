import { useEffect, useState } from "react";
import { GoSidebarCollapse } from "react-icons/go";
import { formatTime } from "../util/Other";

const Header = () => {
  const [timeUsed, setTimeUsed] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUsed((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  return (
    <div className="w-full h-8 border-b border-b-neutral-300 bg-pink-50">
      <div className="flex px-2 w-full h-full items-center justify-between">
        <div className="flex items-center">
          <button className="text-neutral-700">
            <GoSidebarCollapse />
          </button>
        </div>

        <div className="flex space-x-2">
          <p className="text-neutral-700 text-base/8">Tid brukt: {formatTime(timeUsed)}</p>

        </div>
      </div>
    </div>
  );
};

export default Header;
