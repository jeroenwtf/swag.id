import { createContext, useState } from 'react'

const UserDataContext = createContext({
    modalIsShown: false,
    setModalIsShown: (value) => undefined
})

export const UserDataContextProvider = (props) => {
    const [modalIsShown, setModalIsShown] = useState(false)

    return (
        <UserDataContext.Provider
            value={{
                modalIsShown,
                setModalIsShown,
            }}>
            {props.children}
        </UserDataContext.Provider>
    )
}

export default UserDataContext