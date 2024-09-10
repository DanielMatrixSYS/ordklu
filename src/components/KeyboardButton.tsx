import React from "react";

interface KeyboardButtonProps {
  value: string;
  OnClick: () => void;
  loading: boolean;
}

const KeyboardButton: React.FC<KeyboardButtonProps> = ({
  value,
  OnClick,
  loading,
}) => {
  return (
    <button
      className={`bg-neutral-100 border w-[29px] h-14 text-lg font-bold md:hover:bg-blue-700 active:bg-blue-700 transition-all duration-200 ease-in-out rounded`}
      onClick={OnClick}
      disabled={loading}
    >
      {value}
    </button>
  );
};

export default KeyboardButton;
