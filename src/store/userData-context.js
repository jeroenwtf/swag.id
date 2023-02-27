import { createContext, useState } from 'react'

const UserDataContext = createContext({
    modalIsShown: false,
    setModalIsShown: (value) => undefined,
    name: '',
    bio: '',
    username: '',
    image:''
})

export const UserDataContextProvider = (props) => {
    const [modalIsShown, setModalIsShown] = useState(false)

    return (
        <UserDataContext.Provider
            value={{
                modalIsShown,
                setModalIsShown,
                name: 'HP',
                bio: 'HP is a wizard',
                username: 'HP_wizard_scar',
                image:'url'
            }}>
            {props.children}
        </UserDataContext.Provider>
    )
}

export default UserDataContext