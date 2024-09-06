import React from "react";
import { FaSpinner } from "react-icons/fa";

const Loader: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="flex flex-row items-center justify-center text-neutral-700 text-2xl space-x-2">
      <p>{text}</p>
      <FaSpinner className="animate-spin" />
    </div>
  );
};

export default Loader;
