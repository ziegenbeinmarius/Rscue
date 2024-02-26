import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { z } from "zod";

export const animalsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z
        .object({
          skip: z.number().optional(),
          take: z.number().optional(),
          filters: z
            .object({
              type: z.string().optional(),
              location: z.union([z.string(), z.array(z.string())]).optional(),
              sex: z.string().optional(),
            })
            .optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const skip = input?.skip ?? 0;
      const take = input?.take ?? 10;
      const totalAnimals = await ctx.prisma.animal.count();
      const totalPages = Math.ceil(totalAnimals / take);
      const currentPage = Math.floor(skip / take) + 1;
      const hasNextPage = currentPage < totalPages;

      const animals = await ctx.prisma.animal.findMany({
        skip: skip,
        take: take,
        where: {
          location: input?.filters?.location
            ? {
                in: Array.isArray(input?.filters?.location)
                  ? input?.filters?.location
                  : [input?.filters?.location],
              }
            : undefined,
        },
        include: { imageUrls: true, favorites: true },
      });

      return {
        data: animals,
        totalPages,
        hasNextPage,
        currentPage,
        totalCount: totalAnimals,
      };
    }),
  findOne: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.animal.findFirst({
      where: { id: input },
      include: { imageUrls: true, favorites: true },
    });
  }),

  add: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(50),
        type: z.string(),
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
      await ctx.prisma.animal.delete({
        where: { id: input.animalId },
      });
    }),
});
