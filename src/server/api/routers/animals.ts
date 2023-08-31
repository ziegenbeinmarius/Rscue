import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { z } from "zod";

export const animalsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.animal.findMany({
      include: { imageUrls: true, favorites: true },
    });
  }),
  findOne: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.animal.findFirst({
      include: { imageUrls: true, favorites: true },
    });
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
        location: z.string(),
        sex: z.string(),
        age: z.string(),
        size: z.string(),
        characteristics: z.string(),
        health: z.string(),
        color: z.string(),
        race: z.string(),
        imageUrls: z.string().url().array(),
        description: z.string().max(1023),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // console.log(input.imageUrls);

      const animal = await ctx.prisma.animal.create({
        data: {
          name: input.name,
          type: input.type,
          location: input.location,
          sex: input.sex,
          age: parseInt(input.age),
          size: input.size,
          characteristics: input.characteristics,
          health: input.health,
          color: input.color,
          race: input.race,
          imageUrls: {
            create: input.imageUrls.map((url) => ({ url })),
          },
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
