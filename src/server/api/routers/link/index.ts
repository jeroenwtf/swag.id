import { z } from "zod";
import { rules } from './validation';
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../../trpc";

export const linkRouter = createTRPCRouter({
  getLinksByUserId: publicProcedure
    .input(z.object({ userId: rules.userId }))
    .query(({ ctx, input }) => {
      const { userId } = input
      return ctx.prisma.link.findMany({
        where: { userId },
        orderBy: { position: 'desc' },
      });
    }),

  addLink: protectedProcedure
    .input(z.object({
      text: rules.text,
      href: rules.href,
      position: rules.position,
    }))
    .mutation(({ ctx, input }) => {
      const { text, href, position } = input
      const userId = ctx.session.userId
      return ctx.prisma.link.create({
        data: {
          text,
          href,
          position,
          userId,
        },
      })
    }),

  updateLink: protectedProcedure
    .input(z.object({
      text: rules.text,
      href: rules.href,
      id: rules.id,
    }))
    .mutation(({ ctx, input }) => {
      const { text, href, id } = input
      return ctx.prisma.link.update({
        data: {
          text,
          href,
        },
        where: {
          id,
        },
      })
    }),

  removeLink: protectedProcedure
    .input(z.object({
      id: rules.id,
    }))
    .mutation(({ ctx, input }) => {
      const { id } = input
      return ctx.prisma.link.delete({
        where: {
          id,
        },
      })
    }),
});
