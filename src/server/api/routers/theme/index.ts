import { z } from "zod";
import { rules as userRules } from './../user/validation';
import { themeSchema } from "@/validation/theme";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../../trpc";

export const themeRouter = createTRPCRouter({
  getThemeByUserId: publicProcedure
    .input(z.object({ userId: userRules.id }))
    .query(({ ctx, input }) => {
      const { userId } = input
      const userTheme = ctx.prisma.theme.findUnique({
        where: { userId },
      });

      return userTheme
    }),

  updateTheme: protectedProcedure
    .input(themeSchema)
    .mutation(({ ctx, input }) => {
      const { bodyTextColor, bodyBackgroundColor, linkTextColor, linkBackgroundColor } = input
      const userId = ctx.session.userId
      const data = { bodyTextColor, bodyBackgroundColor, linkTextColor, linkBackgroundColor, userId }

      return ctx.prisma.theme.upsert({
        where: { userId },
        create: data,
        update: data,
      })
    }),

});
