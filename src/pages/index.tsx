import { RootLayout } from "@/components/layouts/root";
import { Section } from "@/components/layouts/section";
import { AnimalCards } from "@/components/animals/animalCards";

export default function Home() {
  return (
    <RootLayout>
      <Section>
        <h1>Rscue </h1>
        <h2>Your rescue animal platform</h2>
      </Section>
      <Section>
        <AnimalCards />
      </Section>
    </RootLayout>
  );
}
