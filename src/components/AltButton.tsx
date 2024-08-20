import React from "react";
import { FaSpinner } from "react-icons/fa";

interface AltButtonProps {
  value: string;
  type?: "button" | "reset" | "submit" | undefined;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

const AltButton: React.FC<AltButtonProps> = ({
  value,
  type = "button",
  disabled = false,
  loading = false,
  onClick,
}) => {
  return (
    <button
      type={type}
      className="p-2 mt-8 border border-blue-700 text-sm w-full text-blue-700 active:bg-blue-300 rounded-full"
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <span className="text-neutral-100">{value}</span>

          <FaSpinner className="animate-spin text-neutral-100" />
        </div>
      ) : (
        value
      )}
    </button>
  );
};

export default AltButton;
