import type { GetServerSideProps } from "next";
import UserInfo from '@/components/UserInfo'

import { api } from "@/utils/api";

import UserTopBar from "@/components/UserTopBar";
import UserLinks from '@/components/ui/UserLinks'
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useProfileContext } from "@/store/profile-context";

type Props = {
  username: string,
}

const UsernamePage = ({ username }: Props) => {
  const [isLoading, setIsLoading] = useState(true)
  const [links, setLinks] = useState<any[]>([])
  const { data: sessionData } = useSession()
  const { userData, setUserData } = useProfileContext()
  
  api.user.getByUsername.useQuery({ username }, {
    onSuccess: (data) => {
      setUserData(data)
    },
    onSettled: (data) => {
      setIsLoading(false)
    },
    onError: (error) => {
      console.log('error', error)
    },
  });

  const isOwner = sessionData && sessionData.userId === userData?.id
  
  api.link.getLinksByUserId.useQuery({
    userId: userData?.id || ''
  }, {
    onSuccess: (links) => {
      setLinks(links)
    }
  });
  
  if (isLoading) { return <div>LOADING...</div> }
  if (userData === null) { return <div>NOT FOUND</div> }

  return (
    <div>
      {isOwner &&
        <UserTopBar />
      }
      <div className="p-5 sm:p-10 flex flex-col gap-6 items-center min-h-screen border-gray-100">
        <UserInfo />

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
