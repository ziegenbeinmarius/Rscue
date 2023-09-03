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
      <div className="absolute left-0 top-0 h-screen w-screen ">
        <Image
          className="-translate-x-1/4 translate-y-1/4 scale-125 opacity-30 sm:translate-y-48 sm:scale-100 xl:-translate-x-1/3"
          priority
          src="/img/paw-print.svg"
          fill
          objectFit="contain"
          alt="Background paw print"
        />
      </div>
      <FullscreenLanding />
      <MainContent>
        <Section id="animals">
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
    <section className="relative px-4">
      {/* <div className="absolute left-0 top-0 -z-10  h-screen w-full  "></div> */}
      <div className="m-auto flex max-w-screen-2xl flex-col justify-between gap-8  py-32  ">
        <div className="flex flex-1 flex-col gap-8 lg:flex-row">
          <div className="flex flex-1 flex-col items-center space-y-16 md:items-start">
            <h1 className="text-center md:text-start">
              Find your new <br className="hidden sm:block" />
              pet partner
            </h1>
            <div>
              <Button
                className="font-bold"
                size={"cta"}
                onClick={() => (document.location = "#animals")}
              >
                Look at our animals
              </Button>
            </div>
          </div>
          <aside className="relative flex flex-col gap-16 lg:w-1/2">
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

              <h3 className="max-w-[40%] text-end">
                We will help you to find the perfect fit both for you and the
                pet
              </h3>
            </div>
            <div className="hidden lg:block">
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
      </div>
    </section>
  );
};
