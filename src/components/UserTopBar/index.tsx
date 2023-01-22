import { signOut } from "next-auth/react";

export default function UserTopBar({ isEditing, handleEditProfile }: any) {
  return (
    <div className="bg-black/80 text-gray-100 text-sm px-4 py-2 flex justify-between">
      <div>This is your profile</div>
      <div className="flex gap-2">
        <button onClick={handleEditProfile}>{isEditing ? 'Finish editing' : 'Edit profile'}</button>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    </div>
  )
}
