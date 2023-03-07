import Input from '@/components/Input'
import Modal from '@/components/Modal'
import Avatar from '@/components/ds/Avatar'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'

import { api } from '@/utils/api';
import { z } from 'zod';
import { rules } from '@/server/api/routers/user/validation';

import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from '../Button';
import { useUserContext } from '@/store/user-context'
import { useRef, useState } from 'react';

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
}

export default function UserInfo({ name, bio, image, username }: Props) {
  const meMutation = api.user.me.useMutation()
  const avatarMutation = api.user.avatar.useMutation()
  const displayName = name || username
  const [isLoading, setIsLoading] = useState(false)
  const [imageSrc, setImageSrc] = useState();
  const [uploadData, setUploadData] = useState();
  const { modalIsShown, setModalIsShown } = useUserContext()
  const avatarInputRef = useRef<HTMLInputElement>(null)

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

  const onSubmit: SubmitHandler<ValidationSchema> = async (data, event) => {
    setIsLoading(true)
    let isSuccess = true;
    await meMutation.mutateAsync(data)

    if (avatarInputRef.current?.files?.length) {
      const formData = new FormData();
      for (const file of avatarInputRef.current?.files) {
        formData.append('file', file);
      }

      formData.append('upload_preset', 'swag_id_avatars');

      await fetch('https://api.cloudinary.com/v1_1/dmgib2a0t/image/upload', {
        method: 'POST',
        body: formData
      }).then(r => r.json()).then(async data => {
        await avatarMutation.mutateAsync({
          image: data.url
        })

        if (avatarMutation.isError) { isSuccess = false }
      });
    }

    if (meMutation.isError) { isSuccess = false }

    if (isSuccess) {
      setModalIsShown(false);
      alert('SUCCESS! TODO: Put a toast')
    }
    
    setIsLoading(false)
  }

  function handleOnChange(changeEvent: any) {
    if (changeEvent.target.name === 'avatar') {
      const reader = new FileReader();

      reader.onload = function(onLoadEvent: any) {
        setImageSrc(onLoadEvent.target.result);
        setUploadData(undefined);
      }

      reader.readAsDataURL(changeEvent.target.files[0]);
    }
  }

  return (
    <div className="flex max-w-md w-full text-center items-center flex-col gap-4">
      {image &&
        <Avatar src={image} alt={`Avatar of ${displayName}`} />
      }

      {/* TODO: Make the modal a UI component */}
      <Modal
        open={modalIsShown}
        title="Edit your profile"
        description="Use the following form to update your profile information"
        onClose={() => setModalIsShown(false)}
      >
        {/* <form method="post" onChange={handleOnChangeAvatar} onSubmit={handleOnSubmitAvatar}> */}

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
              <Avatar src={imageSrc || image} alt="Your current avatar" />
              <input ref={avatarInputRef} type="file" name="avatar" className='hidden' />
            </label>

            {uploadData && (
              <code><pre>{JSON.stringify(uploadData, null, 2)}</pre></code>
            )}
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

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setModalIsShown(false)}>Cancel</Button>
            <Button color="pink" type="submit" isLoading={isLoading}>Update profile</Button>
          </div>
          </fieldset>
        </form>
      </Modal>
      <div>
        <h1 className="text-xl font-bold">{displayName}</h1>
        {bio &&
          <p>{bio}</p>
        }
      </div>
      <Button size='small' onClick={() => { setModalIsShown(true) }}>Edit profile info</Button>
    </div>
  )
}
