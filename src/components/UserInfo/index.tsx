import Avatar from '@/components/ds/Avatar'
import UserInfoModal from '@/components/ui/UserInfoModal'

type Props = {
  name: string | null,
  bio: string | null,
  image: string | null,
  username: string,
}

export default function UserInfo({ name, bio, image, username }: Props) {
  const displayName = name || username

  return (
    <div className="flex max-w-md w-full text-center items-center flex-col gap-4">
      {image &&
        <Avatar src={image} alt={`Avatar of ${displayName}`} />
      }

      <UserInfoModal />

      <div>
        <h1 className="text-xl font-bold">{displayName}</h1>
        {bio &&
          <p>{bio}</p>
        }
      </div>
    </div>
  )
}
