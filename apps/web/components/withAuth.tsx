"use client"

import { useRouter } from "next/navigation"
import React, { ComponentType, useEffect, useState } from "react"
import { useSocket } from "~/contexts/SocketContext"
import { useUser } from "~/contexts/UserContext"

const withAuth = <P extends object>(
  WrappedComponent: ComponentType<P>,
): React.FC<P> =>
  function UpdatedComponent(props: P) {
    const { name, avatar } = useUser()
    const { socket } = useSocket()
    const router = useRouter()
    const [verified, setVerified] = useState(false)

    useEffect(() => {
      if (name && avatar && socket) {
        setVerified(true)
      } else {
        router.push("/")
      }
    }, [router, avatar, name, socket])

    if (verified) {
      return <WrappedComponent {...props} />
    } else {
      return null
    }
  }

export default withAuth
