import { createTRPCRouter, protectedProcedure, publicProcedure } from "../../trpc";
import welcomeTemplate from "@/emails/welcome"
import resetPasswordTemplate from "@/emails/resetPassword"
import { generateRandomString } from "@/utils/helpers"
import { forgotPasswordSchema } from "@/validation/auth";
import { z } from "zod";

export const emailRouter = createTRPCRouter({
  welcome: publicProcedure
    .input(z.object({ email: z.string().trim().email() }))
    .mutation(({ input }) => {
      const { email } = input

      return welcomeTemplate.send({
        data: {},
        meta: {
          to: email,
        }
      })
    }),

  resetPassword: publicProcedure
    .input(forgotPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const { email } = input
      let to
      let where

      if (ctx.session) {
        to =  ctx.session?.user?.email
        where = { id: ctx.session.userId }
      } else {
        where = { email }  
        const userData = await ctx.prisma.user.findUnique({ where })
        if (!userData) return true
        to = email
      }

      if (!to) return true

      const resetPasswordToken = generateRandomString(32)
      const resetPasswordTokenExpires = new Date();
      resetPasswordTokenExpires.setDate(resetPasswordTokenExpires.getDate() + 1);

      await ctx.prisma.user.update({
        where,
        data: {
          resetPasswordToken,
          resetPasswordTokenExpires,
        }
      })

      return resetPasswordTemplate.send({
        data: {
          urlHash: resetPasswordToken,
        },
        meta: {
          to,
        }
      })
    }),
});
