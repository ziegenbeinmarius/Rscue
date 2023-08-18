import { cn } from "@/utils";
import React from "react";

interface SectionProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div {...props} className={cn("py-8 sm:py-16", className)}>
      {children}
    </div>
  );
};
