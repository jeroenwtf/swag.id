import { api } from '@/utils/api';
import { useSession } from 'next-auth/react';
import { createContext, useContext, useState } from 'react'

const UserContext = createContext({
  modalIsShown: false,
  setModalIsShown: (value) => undefined,
  id: '',
  name: '',
  bio: '',
  username: '',
  image: ''
})

export const UserContextProvider = ({ children }) => {
  const [modalIsShown, setModalIsShown] = useState(false)
  const { data } = useSession()
  const userId = data && data.user ? data.user.id : ''
  let userData = {}

  const user = api.user.getById.useQuery({ id: userId });

  if (user.data) {
    const { id, name, bio, username, image } = user.data;
    userData = { modalIsShown, setModalIsShown, id, name, bio, username, image }
  }

  return (
    <UserContext.Provider value={userData}>
      {children}
    </UserContext.Provider>
  )
}

export function useUserContext() {
  return useContext(UserContext)
}
