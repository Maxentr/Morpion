import React, { PropsWithChildren } from "react"
import Providers from "./providers"
import "~/styles/globals.css"

const layout = ({ children }: PropsWithChildren) => {
  return (
    <html suppressHydrationWarning>
      <head></head>
      <body>
        <div className="absolute inset-0 bg-tertiary dark:bg-dark-gray flex flex-col">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  )
}
export default layout
