import Input from '@/components/ds/Input';
import Button from '@/components/ds/Button';

import { api } from '@/utils/api';
import { z } from 'zod';
import { rules } from '@/server/api/routers/user/validation';

import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect, useRef, useState } from 'react';
import { useUserContext } from '@/store/user-context';
import { useProfileContext } from '@/store/profile-context';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import Avatar from '@/components/ds/Avatar';
import { toast } from 'react-hot-toast';

const validationSchema = z.object({
  name: rules.name,
  bio: rules.bio,
  username: rules.username,
})

type ValidationSchema = z.infer<typeof validationSchema>;

export default function ProfileTab() {
  const { userData: profileData, setUserData } = useProfileContext()
  const [isLoading, setIsLoading] = useState(false)
  const [imageSrc, setImageSrc] = useState(profileData.image)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const { data: userData } = useUserContext()

  const updateUserMutation = api.user.updateUser.useMutation({
    onMutate: () => {
      setIsLoading(true)
    },
    onSettled: () => {
      setIsLoading(false)
    },
    onSuccess: async (data) => {
      toast.success('Profile updated successfully')
      if (data.username !== userData.username) {
        console.log('Username changed, redirect required') // TODO: Do this
      }
      setUserData(data)
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    defaultValues: {
      name: profileData.name,
      bio: profileData.bio,
      username: profileData.username,
    },
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
    let imageUrl = ''

    if (avatarInputRef.current?.files?.length) {
      const formData = new FormData();
      for (const file of avatarInputRef.current?.files) {
        formData.append('file', file);
      }

      formData.append('upload_preset', 'swag_id_avatars');

      await fetch('https://api.cloudinary.com/v1_1/dmgib2a0t/image/upload', {
        method: 'POST',
        body: formData
      }).then(r => r.json()).then(data => {
        imageUrl = data.secure_url
      });
    }

    await updateUserMutation.mutateAsync({
      ...data,
      image: imageUrl || '',
    })
  }

  function handleOnChange(changeEvent: any) {
    if (changeEvent.target.name === 'avatar') {
      const reader = new FileReader();

      reader.onload = function(onLoadEvent: any) {
        setImageSrc(onLoadEvent.target.result);
      }

      reader.readAsDataURL(changeEvent.target.files[0]);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onChange={handleOnChange}
    >
      <fieldset disabled={isLoading} className="flex flex-col gap-3">
        <div>
          <label className="cursor-pointer inline-block relative group">
            <div className="absolute z-10 inset-0 flex justify-center items-center">
              <div className="bg-black/60 p-3 rounded-full w-12 h-12 text-white flex justify-center items-center group-hover:w-14 group-hover:h-14 transition-all">
                <FontAwesomeIcon icon={faPenToSquare} />
              </div>
            </div>
            <Avatar src={imageSrc || userData?.image} alt="Your current avatar" />
            <input ref={avatarInputRef} type="file" name="avatar" className='hidden' />
          </label>
        </div>

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
        <Input
          label="Username"
          hint="Will be used in your URL"
          // required
          type="text"
          prefix="https://swag.id/"
          placeholder="Your username"
          errors={errors.username}
          {...register('username')}
        />

        <div className="flex gap-2 mt-6">
          <Button color="pink" type="submit" isLoading={isLoading}>Save your profile data</Button>
        </div>
      </fieldset>
    </form>
  )
}
