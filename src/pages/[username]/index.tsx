import type { GetServerSideProps } from "next";
import UserInfo from '@/components/UserInfo'
import { notFound } from 'next/navigation'

import { api } from "../../utils/api";

import UserTopBar from "@/components/UserTopBar";
import { useSession } from "next-auth/react";
import Link from "next/link";

type Props = {
  username: string,
}

const UsernamePage = ({ username }: Props) => {
  const { data: sessionData } = useSession();
  // TODO: Move this to getServerSideProps to avoid all the TS crap
  const user = api.user.getByUsername.useQuery({ username });

  if (user.isLoading) {
    return <div>Loading</div>
  } else if (!user || !user.data) {
    notFound()
  }

  const { name, bio, image } = user.data

  const showUserTopBar = sessionData && sessionData.user?.id === user.data.id

  return (
    <div>
      {showUserTopBar &&
        <UserTopBar />
      }
      <div className="p-10 flex flex-col gap-6 items-center min-h-screen border-gray-100">
        <UserInfo name={name} bio={bio} image={image} username={username} />

        <div>
          Links here
        </div>
        <div className="text-center opacity-40">
          <Link href="/" className="font-bold">SWAG<span className="opacity-60">.id</span></Link>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      username: query.username,
    }
  }
}

export default UsernamePage;
