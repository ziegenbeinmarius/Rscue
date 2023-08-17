import React from "react";

interface SectionProps {
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ children }) => {
  return <div className="py-8 sm:py-16">{children}</div>;
};
