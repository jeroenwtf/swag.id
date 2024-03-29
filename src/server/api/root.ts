import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { userRouter } from "./routers/user";
import { linkRouter } from "./routers/link";
import { themeRouter } from "./routers/theme";
import { emailRouter } from "./routers/email"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  user: userRouter,
  link: linkRouter,
  theme: themeRouter,
  email: emailRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
