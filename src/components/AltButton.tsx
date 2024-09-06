import React from "react";
import { FaSpinner } from "react-icons/fa";

interface AltButtonProps {
  value: string;
  type?: "button" | "reset" | "submit" | undefined;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
}

const AltButton: React.FC<AltButtonProps> = ({
  value,
  type = "button",
  disabled = false,
  loading = false,
  icon,
  onClick,
}) => {
  return (
    <button
      type={type}
      className="flex items-center justify-center w-full p-2 border border-blue-700 text-sm text-blue-700 active:bg-blue-300 rounded-full bg-transparent mt-4 hover:scale-105 transition-all duration-300"
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <span className="text-neutral-600">{value}</span>

          <FaSpinner className="animate-spin text-neutral-100" />
        </div>
      ) : (
        <div className="flex flex-row items-center justify-center">
          {icon && <div className="mr-2">{icon}</div>}
          <span className="text-blue-600">{value}</span>
        </div>
      )}
    </button>
  );
};

export default AltButton;
