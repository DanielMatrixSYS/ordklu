import React from "react";

const Button: React.FC<{ value: string }> = ({ value }) => {
  return <button className="border">{value}</button>;
};

export default Button;
