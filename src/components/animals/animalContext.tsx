import { RouterOutputs } from "@/utils/api";
import { createContext, useContext } from "react";

type AnimalOutput = RouterOutputs["animals"]["getAll"]["data"][0];

export const AnimalsContext = createContext<AnimalOutput[] | undefined>(
  undefined
);

export function useAnimalsContext() {
  const context = useContext(AnimalsContext);
  if (!context) {
    throw new Error("useAnimalsContext must be used within a AnimalsProvider");
  }
  return context;
}
