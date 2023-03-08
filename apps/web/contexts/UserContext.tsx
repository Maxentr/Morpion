"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { Avatar } from "shared-types"

type UserContextInterface = {
  name: string
  avatar: Avatar
  setName: (name: string) => void
  setAvatar: (avatar: Avatar) => void
  saveUserInLocalStorage: () => void
}

const UserContext = createContext({} as UserContextInterface)

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [name, setName] = useState<string>("")
  const [avatar, setAvatar] = useState<Avatar>("" as Avatar)
  const [isFirstRender, setIsFirstRender] = useState(true)

  useEffect(() => {
    setName(localStorage.getItem("name") || "")
    setAvatar((localStorage.getItem("avatar") as Avatar) || "")
    setIsFirstRender(false)
  }, [])

  const saveUserInLocalStorage = () => {
    localStorage.setItem("name", name)
    localStorage.setItem("avatar", avatar)
  }

  if (isFirstRender) return <></>

  return (
    <UserContext.Provider
      value={{
        name,
        avatar,
        setName,
        setAvatar,
        saveUserInLocalStorage,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
export default UserProvider
