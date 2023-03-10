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
      const userId = ctx.session.user.id
      return ctx.prisma.link.create({
        data: {
          text,
          href,
          position,
          userId,
        },
      })
    }),
});
