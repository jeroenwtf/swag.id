import Image from 'next/image';
import Input from '@/components/Input'
import { useState } from 'react';
import { api } from '@/utils/api';
import { z } from 'zod';
import { ZodError } from 'zod';
import { rules } from '@/server/api/routers/user/validation';

import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const validationSchema = z.object({
  name: rules.name,
  bio: rules.bio,
})

type ValidationSchema = z.infer<typeof validationSchema>;

export default function UserInfo({ user, username, editMode }) {
  const meMutation = api.user.me.useMutation()
  const { name, bio, image } = user.data
  const displayName = name || username

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    defaultValues: {
      name,
      bio,
    },
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<ValidationSchema> = (data) => {
    meMutation.mutate(data)
  }

  return (
    <div className="flex max-w-md w-full text-center items-center flex-col gap-4">
      {image &&
        <Image src={image} alt={`Avatar of ${displayName}`} width={96} height={96} className="rounded-full w-24 h-24" />
      }
      {editMode ? (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <Input
            label="Name"
            type="text"
            placeholder="Your name"
            errors={errors.name}
            {...register('name')}
          />
          <Input
            label="Bio"
            type="text"
            placeholder="Your bio"
            errors={errors.bio}
            {...register('bio')}
          />
          <button className="bg-gradient-to-br from-rose-700 to-red-400 text-white font-semibold px-4 py-3 rounded" type="submit">Update profile</button>
        </form>
      ) : (
        <div>
          <h1 className="text-xl font-bold">{displayName}</h1>
          {bio &&
            <p>{bio}</p>
          }
        </div>
      )}
    </div>

  )
}
