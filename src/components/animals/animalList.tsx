import { RouterOutputs, api } from "@/utils/api";
import React, { useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, ImageIcon, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Loader } from "../ui/loader";
import { ScrollArea } from "../ui/scroll-area";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Link from "next/link";
import { useAnimalsContext } from "./animalContext";

interface AnimalCardsProps {}

type AnimalOutput = RouterOutputs["animals"]["getAll"]["data"][0];
export const AnimalList: React.FC<AnimalCardsProps> = () => {
  const animals = useAnimalsContext();

  return (
    <div className="space-y-4">
      <h2>Our animals</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {animals.map((animal) => {
          return <AnimalCard animal={animal} key={animal.id} />;
        })}
      </div>
    </div>
  );
};

interface AnimalCardProps {
  animal: AnimalOutput;
}
const AnimalCard: React.FC<AnimalCardProps> = ({ animal }) => {
  const { data: sessionData } = useSession();
  const { mutate: mutateDeleteAnimal } = api.animals.delete.useMutation();
  const ctx = api.useContext();
  const [openDialog, setOpenDialog] = useState(false);

  function handleAnimalDialog() {
    setOpenDialog(!openDialog);
  }

  function deleteAnimal(animalId: string) {
    mutateDeleteAnimal(
      { animalId },
      {
        onSuccess: () => {
          ctx.animals.invalidate();
        },
      }
    );
  }
  if (!animal) {
    return <></>;
  }
  return (
    <>
      <Card onClick={handleAnimalDialog} className="cursor-pointer">
        <CardHeader>
          <CardTitle>
            <div className="flex flex-row items-center justify-between">
              <p>{animal.name}</p>
              {sessionData && (
                <Button
                  variant={"destructive"}
                  size={"icon_small"}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteAnimal(animal.id);
                  }}
                >
                  <X size={20} />
                </Button>
              )}
            </div>
          </CardTitle>
          <CardDescription>
            {animal.sex} {animal.type}, {animal.age} years old,{" "}
            {animal.location}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {animal.imageUrls && animal.imageUrls.length > 0 && (
            <div
              className="relative h-48 w-full"
              key={`img_${animal.name}_${animal.id}`}
            >
              <Image
                className="object-contain"
                fill
                sizes="(max-width: 200px)"
                alt={`Image of ${animal.name}`}
                src={animal.imageUrls[0]!.url}
              ></Image>
            </div>
          )}
          <Link href={`/animals/${animal.id}`}>
            <Button className="w-full">Details</Button>
          </Link>
        </CardContent>
      </Card>
      <AnimalDialog
        animal={animal}
        open={openDialog}
        handleOpen={handleAnimalDialog}
      />
    </>
  );
};

interface AnimalDialogProps {
  animal: AnimalOutput;
  open: boolean;
  handleOpen: () => void;
}
const AnimalDialog: React.FC<AnimalDialogProps> = ({
  animal,
  open,
  handleOpen,
}) => {
  if (!animal) {
    return <></>;
  }
  // TODO make card clickable but dont open dialog on remove animal
  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{animal.name}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[70vh] pr-4">
          <Carousel>
            <CarouselContent>
              {animal.imageUrls &&
                animal.imageUrls.length > 0 &&
                animal.imageUrls.map((imageUrl, index) => (
                  <CarouselItem
                    className="relative h-96 max-h-[30vh] w-full"
                    key={`img_${animal.name}_${animal.id}_${index}`}
                  >
                    <Image
                      className="object-contain"
                      fill
                      sizes="(max-width: 672px )"
                      alt={`Image of ${animal.name}_${index}`}
                      src={imageUrl.url}
                    ></Image>
                  </CarouselItem>
                ))}
            </CarouselContent>
            {animal.imageUrls.length > 1 && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )}
          </Carousel>

          <p>{animal.description}</p>
          <p>Age: {animal.age} years old</p>
          <p>Sex: {animal.sex}</p>
          <p>Size: {animal.size}</p>
          <p>Character: {animal.characteristics}</p>
          <p>Color: {animal.color}</p>
          <p>Health: {animal.health}</p>
          <p>Race: {animal.race}</p>
          <p>Sex: {animal.sex}</p>
          <Link href={`/animals/${animal.id}`}>
            <Button>Details</Button>
          </Link>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
