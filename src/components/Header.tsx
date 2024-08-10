import { useEffect, useState } from "react";

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
        <div className="items-center">
          <p className="text-base/8">Ordklu</p>
        </div>

        <div>
          <p>Tid brukt: {timeUsed}s</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
