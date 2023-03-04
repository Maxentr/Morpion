import Image from "next/image"
import React from "react"

export type Avatar =
  | "bee"
  | "crab"
  | "dog"
  | "elephant"
  | "fox"
  | "frog"
  | "koala"
  | "octopus"
  | "penguin"
  | "turtle"
  | "whale"

type Props = {
  avatar: Avatar
  pseudo: string
}

const Avatar = ({ avatar, pseudo }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <Image
        src={`/avatars/${avatar}.png`}
        width={100}
        height={100}
        alt={avatar}
      />
      <p className="text-center text-lg">{pseudo}</p>
    </div>
  )
}

export default Avatar
