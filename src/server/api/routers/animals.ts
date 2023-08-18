import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { z } from "zod";

export const animalsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.animal.findMany();
  }),

  add: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(50),
        type: z.union([
          z.literal("Cat"),
          z.literal("Dog"),
          z.literal("Monkey"),
        ]),
        image: z.string().optional(),
        description: z.string().max(1023),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const animal = await ctx.prisma.animal.create({
        data: {
          name: input.name,
          type: input.type,
          image: input.image,
          description: input.description,
        },
      });
      return animal;
    }),
  delete: protectedProcedure
    .input(z.object({ animalId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.animal.delete({ where: { id: input.animalId } });
    }),
});
