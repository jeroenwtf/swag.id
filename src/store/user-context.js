import { api } from '@/utils/api';
import { useSession } from 'next-auth/react';
import { createContext, useContext, useEffect, useState } from 'react'

const UserContext = createContext({
  modalIsShown: false,
  setModalIsShown: (value) => undefined,
  data: {
    id: '',
    name: '',
    bio: '',
    email: '',
    username: '',
    image: '',
  },
  isLoading: false,
})

export const UserContextProvider = ({ children }) => {
  const [modalIsShown, setModalIsShown] = useState(false)
  const { data: sessionData } = useSession()
  const userId = sessionData && sessionData.user ? sessionData.user.id : ''
  let contextData = {
    modalIsShown,
    setModalIsShown,
    isLoading: true,
  }

  const { isLoading, data: userData } = api.user.getById.useQuery({ id: userId });

  if (!isLoading) {
    contextData = {
      ...contextData,
      data: userData,
      isLoading,
    }
  }

  return (
    <UserContext.Provider value={contextData}>
      {children}
    </UserContext.Provider>
  )
}

export function useUserContext() {
  return useContext(UserContext)
}
