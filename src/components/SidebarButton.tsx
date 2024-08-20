import React from "react";
import { PiCaretRight } from "react-icons/pi";

const SidebarButton: React.FC<{ value: string; onClick: () => void }> = ({
  value,
  onClick,
}) => {
  return (
    <button
      className="flex p-2 border hover:bg-neutral-400/80 active:bg-neutral-400/80 border-neutral-400 rounded"
      onClick={onClick}
    >
      <div className="flex flex-grow items-center justify-between">
        <p className="text-neutral-700 text-md/8">{value}</p>
        <PiCaretRight className="text-neutral-700" />
      </div>
    </button>
  );
};

export default SidebarButton;
