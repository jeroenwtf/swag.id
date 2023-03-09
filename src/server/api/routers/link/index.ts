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
        orderBy: { position: 'asc' },
      });
    }),
});
