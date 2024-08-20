import React from "react";
import { FaSpinner } from "react-icons/fa";

interface ButtonProps {
  value: string;
  type?: "button" | "reset" | "submit" | undefined;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  value,
  type = "button",
  disabled = false,
  loading = false,
  onClick,
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className="flex w-full items-center justify-center p-2 bg-blue-700 text-sm font-light text-white rounded-full active:bg-blue-800"
      onClick={onClick}
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

export default Button;
