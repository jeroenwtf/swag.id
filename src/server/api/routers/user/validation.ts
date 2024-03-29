import { z } from "zod";

export const rules = {
  id: z.string().trim(),
  name: z.string().trim().max(30, { message: 'The name needs to be 30 or fewer characters long.' }),
  bio: z.string().trim().max(160, { message: 'The bio needs to be 160 or fewer characters long.' }),
  email: z.string().trim().email('The email is not valid.'),
  username: z.string().trim().min(1, { message: 'A username is required.'}),
  password: z.string().min(8, { message: 'The password needs to be at least 8 characters long.'}),
  image: z.string().trim(),
}

export const schema = z.object({
  id: rules.id,
  name: rules.name,
  bio: rules.bio,
  email: rules.email,
  username: rules.username,
  password: rules.password,
  image: rules.image,
})
