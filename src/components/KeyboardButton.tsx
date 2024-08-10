import React from "react";

const KeyboardButton: React.FC<{ value: string; OnClick: () => void }> = ({
  value,
  OnClick,
}) => {
  return (
    <button
      className="bg-neutral-100 border w-7 h-14 text-lg font-bold md:hover:bg-blue-700 transition-all duration-200 ease-in-out"
      onClick={OnClick}
    >
      {value}
    </button>
  );
};

export default KeyboardButton;
