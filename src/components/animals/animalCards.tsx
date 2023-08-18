import { api } from "@/utils/api";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface AnimalCardsProps {
  fuck?: string;
}

export const AnimalCards: React.FC<AnimalCardsProps> = () => {
  const { data: animals, isLoading } = api.animals.getAll.useQuery();

  if (isLoading) {
    return (
      <div>
        <h2>Loading animals</h2>
      </div>
    );
  }
  if (!animals) {
    return (
      <div>
        <h2>No Animals</h2>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2>Our animals</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {animals.map((animal) => {
          return (
            <Card key={animal.id}>
              <CardHeader>
                <CardTitle>{animal.name}</CardTitle>
                <CardDescription>{animal.type}</CardDescription>
              </CardHeader>
              <CardContent>{animal.description}</CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
