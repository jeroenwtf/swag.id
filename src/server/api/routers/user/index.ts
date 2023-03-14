import { z } from "zod";
import { rules } from './validation';
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../../trpc";
import * as trpc from "@trpc/server"
import { signupSchema, accountSettingsSchema } from "@/validation/auth";
import { hash } from "argon2";

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

  signUp: publicProcedure
    .input(signupSchema)
    .mutation(async ({ ctx, input }) => {
      const { email, password, username } = input

      const exists = await ctx.prisma.user.findFirst({
        where: { email },
      })
      
      if (exists) {
        throw new trpc.TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        })
      }

      const hashedPassword = await hash(password)

      const result: any = await ctx.prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        }
      })

      return {
        status: 201,
        message: 'Account created successfully',
        result: result.email,
      }
    }),

  checkEmailAndPassword: publicProcedure
    .input(z.object({
      email: rules.email,
      password: rules.password,
    }))
    .query(async ({ ctx, input }) => {
      const { email, password } = input
      const user: any = await ctx.prisma.user.findUnique({
        where: {
          email
        }
      })

      if (!user) {
        return false
      }

      const checkPassword = password === user.password

      if (!checkPassword) {
        return false
      }

      return user
    }),

  getById: publicProcedure
    .input(z.object({ id: rules.id }))
    .query(({ ctx, input }) => {
      const { id } = input
      return ctx.prisma.user.findUnique({
        where: {
          id
        }
      });
    }),

  updateUser: protectedProcedure
    .input(z.object({
      name: rules.name,
      bio: rules.bio,
      username: rules.username,
      image: rules.image,
    }))
    .mutation(({ ctx, input }) => {
      const { name, bio, username, image } = input
      let data: any = {
        name,
        bio,
        username,
      }

      if (image !== '') {
        data = { ...data, image }
      }

      return ctx.prisma.user.update({
        where: {
          id: ctx.session.userId,
        },
        data,
      })
    }),

  updateAccount: protectedProcedure
    .input(accountSettingsSchema)
    .mutation(async ({ ctx, input }) => {
      const { email, password } = input    
      let data:{ email: string, password?: string } = { email }
      
      if (password && password !== '') {
        const hashedPassword = await hash(password)
        data = {
          ...data,
          password: hashedPassword,
        }
      }

      return ctx.prisma.user.update({
        where: {
          id: ctx.session.userId,
        },
        data,
      })
    }),

  updateUsername: protectedProcedure
    .input(z.object({
      username: rules.username,
    }))
    .mutation(({ ctx, input }) => {
      const { username } = input
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.userId,
        },
        data: { username },
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
          id: ctx.session.userId,
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
