import { AnimalsContext } from "@/components/animals/animalContext";
import { AnimalList } from "@/components/animals/animalList";
import { MainContent } from "@/components/layouts/mainContent";
import { RootLayout } from "@/components/layouts/root";
import { Section } from "@/components/layouts/section";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import React from "react";
import MultipleSelector, { Option } from "@/components/ui/multi-select";

export default function AnimalsPage() {
  const OPTIONS: Option[] = [
    { label: "Stockholm", value: "Stockholm" },
    { label: "Gothenburg", value: "Gothenburg" },
  ];
  const router = useRouter();
  const skip = Number(router.query.skip) || 0;
  // Could also be added into url and allow adjust
  const take = Number(router.query.take) || 10;
  const locations = router.query.location;

  const { data: response, isLoading } = api.animals.getAll.useQuery({
    skip,
    take,
    filters: { location: locations },
  });
  const animals = response?.data || [];
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!response?.data) {
    return <div>No Animals...</div>;
  }
  const single: Option[] =
    !Array.isArray(locations) && locations
      ? [{ label: locations ?? "", value: locations ?? "" }]
      : [];

  const ayo: Option[] = Array.isArray(locations)
    ? locations.map((l) => ({ label: l, value: l }))
    : single;

  return (
    <RootLayout>
      <MainContent>
        <Section id="animals">
          <MultipleSelector
            value={ayo}
            onChange={(option) =>
              handleFilter({ location: option.map((o) => o.value) })
            }
            defaultOptions={OPTIONS}
            placeholder="Select frameworks you like..."
            emptyIndicator={
              <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                no results found.
              </p>
            }
          />
          <AnimalsContext.Provider value={animals}>
            <AnimalList />
          </AnimalsContext.Provider>
          <AnimalPagination
            currentPage={response.currentPage}
            totalPages={response.totalPages}
            hasNextPage={response.hasNextPage}
            handlePage={handlePage}
          />
        </Section>
      </MainContent>
    </RootLayout>
  );

  function handlePage(page: number) {
    const newSkip = (page - 1) * take;
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, skip: newSkip < 0 ? 0 : newSkip },
      },
      undefined,
      { scroll: false }
    );
  }
  function handleFilter(filters: { location: string[] }) {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, skip, location: [...filters.location] },
      },
      undefined,
      { scroll: false }
    );
  }
}

interface AnimalPaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  handlePage: (page: number) => void;
}
const AnimalPagination: React.FC<AnimalPaginationProps> = ({
  currentPage,
  totalPages,
  hasNextPage,
  handlePage,
}) => {
  return (
    <Pagination className="pt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={currentPage === 1}
            onClick={
              currentPage !== 0 ? () => handlePage(currentPage - 1) : undefined
            }
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            isActive={currentPage === 1}
            onClick={() => handlePage(1)}
          >
            {1}
          </PaginationLink>
        </PaginationItem>
        {currentPage > 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {Array.from({ length: 3 }, (_, i) => {
          const basePage = currentPage - 1;
          const adjustForFirstPage = currentPage === 1 ? 1 : 0;
          const adjustForLastPage = currentPage === totalPages ? 1 : 0;

          return basePage + i + adjustForFirstPage - adjustForLastPage;
        })
          .filter((value) => value !== 1 && value !== totalPages)
          .map(
            (page) =>
              page > 0 &&
              page <= totalPages && (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => handlePage(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
          )}

        {currentPage < totalPages - 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {totalPages > 1 && (
          <PaginationItem>
            <PaginationLink
              isActive={currentPage === totalPages}
              onClick={() => handlePage(totalPages)}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            disabled={!hasNextPage}
            onClick={
              hasNextPage ? () => handlePage(currentPage + 1) : undefined
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
