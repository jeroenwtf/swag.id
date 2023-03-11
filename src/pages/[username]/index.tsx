import type { GetServerSideProps } from "next";
import UserInfo from '@/components/UserInfo'

import { api } from "@/utils/api";

import UserTopBar from "@/components/UserTopBar";
import UserLinks from '@/components/ui/UserLinks'
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

type Props = {
  username: string,
}

const UsernamePage = ({ username }: Props) => {
  const [links, setLinks] = useState<any[]>([])
  const { data: sessionData } = useSession();
  const user = api.user.getByUsername.useQuery({ username });
  const isOwner = sessionData && sessionData.user?.id === user?.data?.id
  
  api.link.getLinksByUserId.useQuery({
    userId: user.data?.id || ''
  }, {
    onSuccess: (links) => { setLinks(links) }
  });

  if (user.isLoading) {
    return <div>Loading</div>
  } else if (!user || !user.data) {
    return <div>Not found</div>
    // notFound()
  }

  const { name, bio, image } = user.data

  return (
    <div>
      {isOwner &&
        <UserTopBar />
      }
      <div className="p-5 sm:p-10 flex flex-col gap-6 items-center min-h-screen border-gray-100">
        <UserInfo name={name} bio={bio} image={image} username={username} />

        {links && <UserLinks links={links} setLinks={setLinks} isOwner={isOwner} />}

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
