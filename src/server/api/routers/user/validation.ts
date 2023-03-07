import { z } from "zod";

export const rules = {
  id: z.string().trim(),
  name: z.string().trim().max(30, { message: 'The name needs to be 30 or fewer characters long.' }),
  bio: z.string().trim().max(160, { message: 'The bio needs to be 160 or fewer characters long.' }),
  username: z.string(),
  image: z.string().trim(),
}

export const schema = z.object({
  id: rules.id,
  name: rules.name,
  bio: rules.bio,
  username: rules.username,
  image: rules.image,
})
