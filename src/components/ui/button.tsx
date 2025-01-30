import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "outline" | "solid";
  className?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant, className, children, ...props }) => {
  return (
    <button
      className={`btn ${variant === "outline" ? "btn-outline" : "btn-solid"} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};