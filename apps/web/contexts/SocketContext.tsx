"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"

type SocketContextInterface = {
  socket: Socket | null
  connect: (namespace?: string) => Socket
}

const SocketContext = createContext({} as SocketContextInterface)

const SocketContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    return () => {
      socket && socket.disconnect()
    }
  }, [socket])

  const connect = (namespace?: string) => {
    if (socket) socket.disconnect()

    const newSocket = io(`http://localhost:3001/${namespace}`, {
      transports: ["websocket"],
    })

    setSocket(newSocket)
    return newSocket
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        connect,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)
export default SocketContextProvider
