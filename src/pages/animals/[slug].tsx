import { MainContent } from "@/components/layouts/mainContent";
import { RootLayout } from "@/components/layouts/root";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import Image from "next/image";

export default function AnimalPage() {
  const router = useRouter();
  const { data: animal, isLoading } = api.animals.findOne.useQuery(
    router.query.slug as string
  );
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!animal) {
    return <div>Loading...</div>;
  }

  return (
    <RootLayout>
      <MainContent>
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
      </MainContent>
    </RootLayout>
  );
}
