import { z } from "zod";

export const rules = {
  bodyTextColor: z.string().trim(),
  bodyBackgroundColor: z.string().trim(),
  linkTextColor: z.string().trim(),
  linkBackgroundColor: z.string().trim(),
}

export const themeSchema = z.object({
  bodyTextColor: rules.bodyTextColor,
  bodyBackgroundColor: rules.bodyBackgroundColor,
  linkTextColor: rules.linkTextColor,
  linkBackgroundColor: rules.linkBackgroundColor,
})

export type ITheme = z.infer<typeof themeSchema>
