import { api } from '@/utils/api';
import { useSession } from 'next-auth/react';
import { createContext, useContext, useState } from 'react'

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
  const userId = sessionData?.userId || ''
  let contextData = {
    modalIsShown,
    setModalIsShown,
    isLoading: true,
  }

  const userQuery = api.user.getById.useQuery({ id: userId });

  if (userQuery.isSuccess) {
    contextData = {
      ...contextData,
      data: userQuery.data,
      isLoading: false,
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
