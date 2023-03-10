"use client"

import React, { PropsWithChildren } from "react"
import withAuth from "../../../components/withAuth"

const AdminLayout = ({ children }: PropsWithChildren) => {
  return <>{children}</>
}

export default withAuth(AdminLayout)
