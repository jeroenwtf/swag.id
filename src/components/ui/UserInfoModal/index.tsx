import Button from "@/components/Button";
import Avatar from "@/components/ds/Avatar";
import Input from '@/components/Input';
import Modal from "@/components/Modal";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'

import { api } from '@/utils/api';
import { z } from 'zod';
import { rules } from '@/server/api/routers/user/validation';

import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useUserContext } from '@/store/user-context'
import { useRef, useState } from 'react';
import { useRouter } from 'next/router'

const validationSchema = z.object({
  name: rules.name,
  bio: rules.bio,
  username: rules.username,
})

type ValidationSchema = z.infer<typeof validationSchema>;

export default function UserInfoModal() {
  const meMutation = api.user.me.useMutation()
  const avatarMutation = api.user.avatar.useMutation()
  const [isLoading, setIsLoading] = useState(false)
  const [imageSrc, setImageSrc] = useState();
  const [uploadData, setUploadData] = useState();
  const { modalIsShown, setModalIsShown, data: userData } = useUserContext()
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    defaultValues: {
      name: userData?.name || '',
      bio: userData?.bio || '',
      username: userData?.username,
    },
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
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
      router.push(`/${data.username}`);
      alert('SUCCESS! Redirect to ' + data.username)
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
    <Modal
      open={modalIsShown}
      title="Edit your profile"
      description="Use the following form to update your profile information"
      onClose={() => setModalIsShown(false)}
    >
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
          <Input
            label="Username"
            hint="Will be used in your URL"
            // required
            type="text"
            placeholder="Your username"
            errors={errors.username}
            {...register('username')}
          />

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setModalIsShown(false)}>Cancel</Button>
            <Button color="pink" type="submit" isLoading={isLoading}>Update profile</Button>
          </div>
        </fieldset>
      </form>
    </Modal>
  )
}
