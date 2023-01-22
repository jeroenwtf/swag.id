import type { GetServerSideProps } from "next";
import UserInfo from '@/components/UserInfo'
import { notFound } from 'next/navigation'

import { api } from "../../utils/api";
import { useState } from "react";
import UserTopBar from "@/components/UserTopBar";
import { useSession } from "next-auth/react";

type Props = {
  username: string,
}

const UsernamePage = ({ username }: Props) => {
  const [isEditing, setIsEditing] = useState(false)
  const { data: sessionData } = useSession();
  const user = api.user.getByUsername.useQuery({ username });

  if (user.isLoading) {
    return <div>Loading</div>
  } else if (!user.data) {
    notFound()
  }

  const showUserTopBar = sessionData && sessionData.user?.id === user.data.id

  function handleEditProfile() {
    setIsEditing(s => !s)
  }

  return (
    <div>
      {showUserTopBar &&
        <UserTopBar isEditing={isEditing} handleEditProfile={handleEditProfile} />
      }
      <div className="p-10 flex justify-center min-h-screen border-gray-100">
        <UserInfo user={user} username={username} editMode={isEditing} />
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
