import React from "react";

interface MainContentProps {
  children: React.ReactNode;
}

export const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return <div className="m-auto max-w-screen-xl p-4 sm:px-8">{children}</div>;
};
