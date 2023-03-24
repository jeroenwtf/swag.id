import { createContext, useContext, useState } from 'react'

const ProfileContext = createContext({
  settingsModalIsShown: false,
  setSettingsModalIsShown: (value) => undefined,
  userData: {
    id: '',
    name: '',
    displayName: '',
    bio: '',
    email: '',
    username: '',
    image: '',
  },
  setUserData: (value) => undefined,
})

export const ProfileContextProvider = ({ children }) => {
  const [settingsModalIsShown, setSettingsModalIsShown] = useState(false)
  const [userData, setUserData] = useState()
  let contextUserData

  if (userData) {
    const displayName = userData.name || userData.username
    contextUserData = { ...userData, displayName }
  }

  const contextData = {
    settingsModalIsShown,
    setSettingsModalIsShown,
    userData: contextUserData,
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
