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
import { Carousel } from "flowbite-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Loader } from "../ui/loader";
import { ScrollArea } from "../ui/scroll-area";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { useRouter } from "next/router";

interface AnimalCardsProps {}

type AnimalOutput = RouterOutputs["animals"]["findOne"];
export const AnimalList: React.FC<AnimalCardsProps> = () => {
  const router = useRouter();
  const listRef = useRef<HTMLDivElement>(null);

  const skip = Number(router.query.skip) || 0;
  // Could also be added into url and allow adjust
  const take = Number(router.query.take) || 6;

  const { data: response, isLoading } = api.animals.getAll.useQuery({
    skip,
    take,
  });
  const animals = response?.data || [];

  const handlePage = (page: number) => {
    const newSkip = (page - 1) * take;
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, skip: newSkip < 0 ? 0 : newSkip },
      },
      undefined,
      { scroll: false }
    );
    listRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="relative w-full">
        <h2>Our animals</h2>
        <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Loader className="absolute" isLoading={true} />
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>
                  <p>...</p>
                </CardTitle>
                <CardDescription>...</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-48 w-full">
                  <ImageIcon className="h-full w-full opacity-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  if (!response?.data) {
    return (
      <div>
        <h2>No Animals</h2>
      </div>
    );
  }

  return (
    <div className="space-y-4" ref={listRef}>
      <h2>Our animals</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {animals.map((animal) => {
          return <AnimalCard animal={animal} key={animal.id} />;
        })}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={
                response.currentPage !== 0
                  ? () => handlePage(response.currentPage - 1)
                  : undefined
              }
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              isActive={response.currentPage === 1}
              onClick={() => handlePage(1)}
            >
              {1}
            </PaginationLink>
          </PaginationItem>
          {response.currentPage > 3 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {Array.from({ length: 3 }, (_, i) => {
            const basePage = response.currentPage - 1;
            const adjustForFirstPage = response.currentPage === 1 ? 1 : 0;
            const adjustForLastPage =
              response.currentPage === response.totalPages ? 1 : 0;

            return basePage + i + adjustForFirstPage - adjustForLastPage;
          })
            .filter((value) => value !== 1 && value !== response.totalPages)
            .map(
              (page) =>
                page > 0 &&
                page <= response.totalPages && (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === response.currentPage}
                      onClick={() => handlePage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
            )}

          {response.currentPage < response.totalPages - 2 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink
              isActive={response.currentPage === response.totalPages}
              onClick={() => handlePage(response.totalPages)}
            >
              {response.totalPages}
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              onClick={
                response.hasNextPage
                  ? () => handlePage(response.currentPage + 1)
                  : undefined
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
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
                    e.preventDefault(), deleteAnimal(animal.id);
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
        <CardContent>
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
          <Carousel
            leftControl={
              <div className="rounded-full bg-primary p-2">
                <ChevronLeft className="text-white" />
              </div>
            }
            rightControl={
              <div className="rounded-full bg-primary p-2">
                <ChevronRight className="text-white" />
              </div>
            }
          >
            {animal.imageUrls &&
              animal.imageUrls.length > 0 &&
              animal.imageUrls.map((imageUrl, index) => (
                <div
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
                </div>
              ))}
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
