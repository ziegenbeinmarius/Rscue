import { createTRPCRouter } from "@/server/api/trpc";
import { animalsRouter } from "./routers/animals";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  animals: animalsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
