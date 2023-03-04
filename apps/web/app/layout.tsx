import React, { PropsWithChildren } from "react"
import "../styles/globals.css"

const layout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="en">
      <head></head>
      <body>
        <div className="absolute inset-0 bg-tertiary flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}
export default layout
