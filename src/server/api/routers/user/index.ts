import { z } from "zod";
import { rules } from './validation';
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../../trpc";

export const userRouter = createTRPCRouter({
  getByUsername: publicProcedure
    .input(z.object({ username: rules.username }))
    .query(({ ctx, input }) => {
      const { username } = input
      return ctx.prisma.user.findUnique({
        where: {
          username
        }
      });
    }),

  me: protectedProcedure
    .input(z.object({
      name: rules.name,
      bio: rules.bio,
    }))
    .mutation(({ ctx, input }) => {
      const { name, bio } = input
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name,
          bio,
        },
      })
    }),

  avatar: protectedProcedure
    .input(z.object({
      image: rules.image,
    }))
    .mutation(({ ctx, input }) => {
      const { image } = input
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          image,
        },
      })
    }),

  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
