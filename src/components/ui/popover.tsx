import * as React from "react";

export const Popover: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="popover">{children}</div>;
};

export const PopoverTrigger: React.FC<{ asChild: boolean; children: React.ReactNode }> = ({ children }) => {
  return <div className="popover-trigger">{children}</div>;
};

export const PopoverContent: React.FC<{ className?: string; align?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => {
  return <div className={`popover-content ${className}`}>{children}</div>;
};
