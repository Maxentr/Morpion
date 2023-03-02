import * as React from "react"

type Props = {
  label: string
}

const Button = ({ label }: Props) => {
  return <button className="bg-red-500">{label}</button>
}

export default Button
