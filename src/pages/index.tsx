import { RootLayout } from "@/components/layouts/root";
import { Section } from "@/components/layouts/section";
import { AnimalCards } from "@/components/animals/animalCards";
import { AnimalWizard } from "@/components/animals/animalWizard";
import { MainContent } from "@/components/layouts/mainContent";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <RootLayout>
      <FullscreenLanding />
      <MainContent>
        <Section>
          <AnimalCards />
        </Section>
        <AnimalWizard />
      </MainContent>
    </RootLayout>
  );
}

interface FullscreenLandingProps {}
const FullscreenLanding: React.FC<FullscreenLandingProps> = () => {
  return (
    <div>
      {/* <div className="absolute left-0 top-0 -z-10  h-screen w-full  "></div> */}
      <div className="relative">
        <div className="m-auto flex max-w-screen-2xl flex-col justify-between gap-8 px-4 py-32 sm:px-8 ">
          <div className="flex flex-1 flex-col md:flex-row ">
            <div className="flex flex-1 flex-col space-y-16">
              <h1>
                Find your new <br className="hidden sm:block" />
                pet partner
              </h1>
              <div>
                <Button className="font-bold" size={"cta"}>
                  Look at our animals
                </Button>
              </div>
            </div>
            <aside className="relative flex flex-col gap-16 md:w-1/2">
              <div className="relative flex flex-row justify-between gap-8">
                <div className=" relative h-72 w-[50rem]">
                  <Image
                    className="w-full rounded-3xl"
                    alt="Dog"
                    src={
                      "https://images.pexels.com/photos/2774140/pexels-photo-2774140.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    }
                    fill={true}
                    objectFit="cover"
                  ></Image>
                </div>

                <h3 className="text-end">We helped with 1k+ adoptions</h3>
              </div>
              <div>
                <div className="relative h-80 w-full">
                  <Image
                    className="w-full rounded-3xl"
                    alt="Cat"
                    src={
                      "https://images.pexels.com/photos/2558605/pexels-photo-2558605.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    }
                    fill={true}
                    objectFit="cover"
                  ></Image>
                </div>
              </div>
            </aside>
          </div>
          {/* <div className="h-64 w-48 "></div> */}
        </div>
      </div>
    </div>
  );
};
