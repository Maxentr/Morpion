import React, { PropsWithChildren } from "react"
import SocketContextProvider from "~/contexts/SocketContext"
import UserContextProvider from "~/contexts/UserContext"
import "~/styles/globals.css"

const layout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="en">
      <head></head>
      <body>
        <div className="absolute inset-0 bg-tertiary dark:bg-dark-gray flex flex-col">
          <SocketContextProvider>
            <UserContextProvider>{children}</UserContextProvider>
          </SocketContextProvider>
        </div>
      </body>
    </html>
  )
}
export default layout
