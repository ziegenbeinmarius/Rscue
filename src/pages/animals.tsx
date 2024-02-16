import { AnimalList } from "@/components/animals/animalList";
import { MainContent } from "@/components/layouts/mainContent";
import { RootLayout } from "@/components/layouts/root";
import { Section } from "@/components/layouts/section";
import React from "react";

interface AnimalsPageProps {}

export default function AnimalsPage() {
  return (
    <RootLayout>
      <MainContent>
        <Section id="animals">
          <AnimalList />
        </Section>
      </MainContent>
    </RootLayout>
  );
}
