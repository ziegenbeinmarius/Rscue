import { api } from "@/utils/api";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface AnimalCardsProps {
  fuck?: string;
}

export const AnimalCards: React.FC<AnimalCardsProps> = () => {
  const { data: sessionData } = useSession();
  const { data: animals, isLoading } = api.animals.getAll.useQuery();
  const { mutate: mutateDeleteAnimal } = api.animals.delete.useMutation();
  const ctx = api.useContext();

  function deleteAnimal(animalId: string) {
    mutateDeleteAnimal(
      { animalId },
      {
        onSuccess: (res) => {
          ctx.animals.invalidate();
        },
      }
    );
  }

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
                <CardTitle>
                  <div className="flex flex-row items-center justify-between">
                    <p>{animal.name}</p>
                    {sessionData && (
                      <Button
                        variant={"destructive"}
                        size={"icon_small"}
                        onClick={() => deleteAnimal(animal.id)}
                      >
                        <X size={20} />
                      </Button>
                    )}
                  </div>
                </CardTitle>
                <CardDescription>{animal.type}</CardDescription>
              </CardHeader>
              <CardContent>
                {animal.image && (
                  <div className="relative h-48 w-full ">
                    <Image
                      alt={`Image of ${animal.name}`}
                      src={animal.image}
                      layout="fill"
                      objectFit="cover"
                    ></Image>
                  </div>
                )}
                <p>{animal.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
