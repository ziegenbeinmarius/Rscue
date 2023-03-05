import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const animalRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.animal.findMany({
        select: {
          name: true,
          type: true,
          description: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.log("error", error);
    }
  }),
  postMessage: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        type: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.animal.create({
          data: {
            name: input.name,
            type: input.type,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
});
