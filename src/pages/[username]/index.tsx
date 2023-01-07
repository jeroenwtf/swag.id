import { useRouter } from "next/router"
import { notFound } from 'next/navigation'

export default function UsernamePage() {
  const router = useRouter()
  const { username } = router.query
  const fullName = false
  const displayName = fullName || username

  if (username !== 'jeroenwtf') {
    notFound()
  }

  return <div>
    <div className="p-10 flex justify-center min-h-screen border-gray-100">
      <div className="flex max-w-md w-full text-center items-center flex-col gap-4">
        <div className="rounded-full bg-gray-700 w-24 h-24">Avatar</div>
        <div>
          <h1 className="text-xl font-bold">{displayName}</h1>
          <p>Bio</p>
        </div>
      </div>
    </div>

  </div>
}
