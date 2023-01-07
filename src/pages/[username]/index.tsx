import Image from 'next/image';
import { notFound } from 'next/navigation'

import { api } from "../../utils/api";

export default function UsernamePage({ username }) {
  const user = api.user.getByUsername.useQuery({ username });

  if (user.isLoading) {
    return <div>Loading</div>
  } else if (!user.data) {
    notFound()
  }

  const displayName = user.data.name || username

  return <div>
    <div className="p-10 flex justify-center min-h-screen border-gray-100">
      <div className="flex max-w-md w-full text-center items-center flex-col gap-4">
        <Image src={user.data.image} alt={`Avatar of ${displayName}`} width={96} height={96} className="rounded-full w-24 h-24" />
        <div>
          <h1 className="text-xl font-bold">{displayName}</h1>
          {user.data.bio &&
            <p>{user.data.bio}</p>
          }
        </div>
      </div>
    </div>
  </div >
}

export function getServerSideProps(ctx) {
  return {
    props: {
      username: ctx.query.username,
    }
  }
}
