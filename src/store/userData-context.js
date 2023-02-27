import React, { useState } from 'react'

const UserDataContext = React.createContext({
    modalIsShown: false,
    onShowModal:()=>{}
})

export const UserDataContextProvider = (props) => {
    const [modalIsShown, setModalIsShown] = useState(false)
    
    const onModalToggle = () => {
        setModalIsShown(!modalIsShown)
    }

    return (
        <UserDataContext.Provider
            value={{
                modalIsShown: modalIsShown,
                onShowModal: onModalToggle
            }}>
            {props.children}
        </UserDataContext.Provider>
    )
}

export default UserDataContext