import { z } from "zod";

export const rules = {
  name: z.string().trim().max(30, { message: 'The name needs to be 30 or fewer characters long.' }),
  bio: z.string().trim().max(160, { message: 'The bio needs to be 160 or fewer characters long.' }),
  username: z.string(),
}

export const schema = z.object({
  name: rules.name,
  bio: rules.bio,
  username: rules.username,
})
