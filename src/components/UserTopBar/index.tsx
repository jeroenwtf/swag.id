import { signOut } from "next-auth/react";
import { useContext } from 'react';
import UserDataContext from '@/store/userData-context'

export default function UserTopBar({ handleEditProfile }: any) {
  const userCtx = useContext(UserDataContext)

  return (
    <div className="bg-black/80 text-gray-100 text-sm px-4 py-2 flex justify-between">
      <div>This is your profile</div>
      <div className="flex gap-2">
        <button onClick={()=>{userCtx.onShowModal()}}>Edit profile</button>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    </div>
  )
}
