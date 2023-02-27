import { api } from '@/utils/api';
import { useSession } from 'next-auth/react';
import { createContext, useState } from 'react'

const UserDataContext = createContext({
  modalIsShown: false,
  setModalIsShown: (value) => undefined,
  id: '',
  name: '',
  bio: '',
  username: '',
  image: ''
})

export const UserDataContextProvider = ({ children }) => {
  const [modalIsShown, setModalIsShown] = useState(false)
  const { data } = useSession()
  const userId = data && data.user ? data.user.id : ''
  let userData = {}

  const user = api.user.getById.useQuery({ id: userId });

  if (user.data) {
    const { id, name, bio, username, image } = user.data;
    userData = { modalIsShown, setModalIsShown, id, name, bio, username, image }
    console.log(userData)
  }

  return (
    <UserDataContext.Provider value={userData}>
      {children}
    </UserDataContext.Provider>
  )
}

export default UserDataContext
