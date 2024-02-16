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

export default function AnimalsPage() {
  const router = useRouter();
  const skip = Number(router.query.skip) || 0;
  // Could also be added into url and allow adjust
  const take = Number(router.query.take) || 10;

  const { data: response, isLoading } = api.animals.getAll.useQuery({
    skip,
    take,
  });
  const animals = response?.data || [];
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!response?.data) {
    return <div>No Animals...</div>;
  }
  return (
    <RootLayout>
      <MainContent>
        <Section id="animals">
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
