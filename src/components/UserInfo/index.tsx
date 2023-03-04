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
import { useUserContext } from '@/store/user-context'

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
  const [imageSrc, setImageSrc] = useState();
  const [uploadData, setUploadData] = useState();
  const { modalIsShown, setModalIsShown } = useUserContext()

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

  function handleOnChangeAvatar(changeEvent) {
    const reader = new FileReader();

    reader.onload = function(onLoadEvent) {
      setImageSrc(onLoadEvent.target.result);
      setUploadData(undefined);
    }

    reader.readAsDataURL(changeEvent.target.files[0]);
  }

  async function handleOnSubmitAvatar(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const fileInput = Array.from(form.elements).find(({ name }) => name === 'avatar');
    const formData = new FormData();

    for (const file of fileInput.files) {
      formData.append('file', file);
    }

    formData.append('upload_preset', 'swag_id_avatars');

    const data = await fetch('https://api.cloudinary.com/v1_1/dmgib2a0t/image/upload', {
      method: 'POST',
      body: formData
    }).then(r => r.json()).then(data => {
      avatarMutation.mutate({
        image: data.url
      })
    });
  }

  return (
    <div className="flex max-w-md w-full text-center items-center flex-col gap-4">
      {image &&
        <Image src={image} alt={`Avatar of ${displayName}`} width={96} height={96} className="rounded-full w-24 h-24" />
      }

      {/* TODO: Make the modal a UI component */}
      <Modal
        open={modalIsShown}
        title="Edit your profile"
        description="Use the following form to update your profile information"
        onClose={() => setModalIsShown(false)}
      >
        <div>
          <form method="post" onChange={handleOnChangeAvatar} onSubmit={handleOnSubmitAvatar}>
            <p>
              <input type="file" name="avatar" />
            </p>

            <img src={imageSrc} />

            {imageSrc && !uploadData && (
              <p>
                <button className="bg-gradient-to-br from-rose-700 to-red-400 text-white font-semibold px-4 py-2 rounded">Upload image</button>
              </p>
            )}

            {uploadData && (
              <code><pre>{JSON.stringify(uploadData, null, 2)}</pre></code>
            )}
          </form>
        </div>

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

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setModalIsShown(false)}>Cancel</Button>
            <Button onClick={() => setModalIsShown(false)} color="pink" type="submit">Update profile</Button>
          </div>
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
