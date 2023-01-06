import { useRouter } from "next/router"

export default function UsernamePage() {
  const router = useRouter()
  const { username } = router.query

  return <div>This will be the page for {username}</div>
}
