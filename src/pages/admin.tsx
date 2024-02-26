import { AnimalWizard } from "@/components/animals/animalWizard";
import { MainContent } from "@/components/layouts/mainContent";
import { RootLayout } from "@/components/layouts/root";
import React from "react";

export default function AdminPage() {
  return (
    <RootLayout>
      <MainContent>
        <AnimalWizard />
      </MainContent>
    </RootLayout>
  );
}
