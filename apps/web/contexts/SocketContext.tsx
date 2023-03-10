"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
import {
  ClientToServerTicTacToeEvents,
  ServerToClientEvents,
  TicTacToe,
} from "shared-utils"

type CustomSocket = Socket<
  ServerToClientEvents<TicTacToe>,
  ClientToServerTicTacToeEvents
>

type SocketContextInterface = {
  socket: CustomSocket | null
  connect: (namespace?: string) => CustomSocket
}

const SocketContext = createContext({} as SocketContextInterface)

const SocketContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<CustomSocket | null>(null)

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
    return newSocket as CustomSocket
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
