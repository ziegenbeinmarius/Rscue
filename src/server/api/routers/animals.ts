import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const animalsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.animal.findMany();
  }),
});
