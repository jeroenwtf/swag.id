import { createContext, useContext, useState } from 'react'

const ProfileContext = createContext({
  settingsModalIsShown: false,
  setSettingsModalIsShown: (value) => undefined,
  userData: {
    id: '',
    name: '',
    bio: '',
    email: '',
    username: '',
    image: '',
  },
  setUserData: (value) => undefined,
})

export const ProfileContextProvider = ({ children }) => {
  const [settingsModalIsShown, setSettingsModalIsShown] = useState(false)
  const [userData, setUserData] = useState({})
  const contextData = {
    settingsModalIsShown,
    setSettingsModalIsShown,
    userData,
    setUserData,
  }

  return (
    <ProfileContext.Provider value={contextData}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfileContext() {
  return useContext(ProfileContext)
}
