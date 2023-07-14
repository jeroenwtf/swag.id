import Avatar from '@/components/ds/Avatar'
import { useProfileContext } from '@/store/profile-context'

export default function UserInfo() {
  const { userData, themeData } = useProfileContext()
  const { displayName, bio, image } = userData

  return (
    <div
      className="flex max-w-md w-full text-center items-center flex-col gap-4"
      style={{ color: themeData?.bodyTextColor }}
    >
      {image &&
        <Avatar src={image} alt={`Avatar of ${displayName}`} />
      }

      <div>
        <h1 className="text-xl font-bold">{displayName}</h1>
        {bio &&
          <p>{bio}</p>
        }
      </div>
    </div>
  )
}
