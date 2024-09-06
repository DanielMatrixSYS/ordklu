import React from "react";
import { FaSpinner } from "react-icons/fa";

interface ButtonProps {
  value: string;
  type?: "button" | "reset" | "submit" | undefined;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
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
      disabled={disabled || loading}
      className="flex w-full items-center justify-center p-2 bg-blue-500 text-white rounded-full hover:scale-105 transition-all duration-300"
      onClick={onClick}
    >
      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <span className="text-neutral-100">{value}</span>

          <FaSpinner className="animate-spin text-neutral-100" />
        </div>
      ) : (
        <div className="flex flex-row items-center justify-center">
          {icon && <div className="mr-2">{icon}</div>}
          <span className="text-neutral-100">{value}</span>
        </div>
      )}
    </button>
  );
};

export default Button;
