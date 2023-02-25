import Image from 'next/image';
import Input from '@/components/Input'
import Modal from '@/components/Modal'
import { api } from '@/utils/api';
import { z } from 'zod';
import { rules } from '@/server/api/routers/user/validation';

import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from '../Button';
import { useEffect, useRef, useState } from 'react';

const validationSchema = z.object({
  name: rules.name,
  bio: rules.bio,
})

type ValidationSchema = z.infer<typeof validationSchema>;

type Props = {
  name?: string,
  bio?: string,
  image?: string,
  username: string,
  editMode: boolean,
}

export default function UserInfo({ name, bio, image, username, editMode }: Props) {
  const meMutation = api.user.me.useMutation()
  const displayName = name || username
  const submitRef = useRef()
  const [modalIsOpen, setModalIsOpen] = useState(false)

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
      {/* TODO: Make the modal a UI component */}
      <Modal
        title="Edit your profile"
        description="Use the following form to update your profile information"
        isOpen={modalIsOpen}
        actions={[
          <Button key="cancelButton" onClick={() => setModalIsOpen(false)}>Cancel</Button>,
          <Button key="submitButton" color="pink" onClick={() => submitRef.current.click()}>Update profile</Button>
        ]}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div>TODO: Avatar field</div>
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
          <button ref={submitRef} type="submit" className='hidden' />
        </form>
      </Modal>
      <div>
        <h1 className="text-xl font-bold">{displayName}</h1>
        {bio &&
          <p>{bio}</p>
        }
      </div>
      <Button onClick={() => setModalIsOpen(true)}>Edit profile info</Button>
    </div>

  )
}
