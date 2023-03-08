import { z } from "zod";

export const rules = {
  id: z.string().trim(),
  userId: z.string(),
  text: z.string().trim().max(30, { message: 'The text needs to be 30 or fewer characters long.' }),
  href: z.string().trim().max(300, { message: 'The href needs to be 300 or fewer characters long.' }),
  position: z.number(),
}

export const schema = z.object({
  id: rules.id,
  userId: rules.userId,
  text: rules.text,
  href: rules.href,
  position: rules.position,
})
