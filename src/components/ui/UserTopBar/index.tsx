import { signOut } from "next-auth/react";
import SettingsModal from "@/components/ui/SettingsModal"
import { useProfileContext } from "@/store/profile-context";

export default function UserTopBar() {
  const { setSettingsModalIsShown } = useProfileContext()

  return (
    <div className="bg-black/80 text-gray-100 text-sm px-4 py-2 flex justify-between">
      <div>This is your profile</div>
      <div className="flex gap-2">
        <button onClick={()=>{setSettingsModalIsShown(true)}}>Settings</button>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
      <SettingsModal />
    </div>
  )
}
