import Image from "next/image"
import React from "react"
import { Avatar } from "shared-types"

type Props = {
  avatar: Avatar
  pseudo?: string
}

const UserAvatar = ({ avatar, pseudo }: Props) => {
  return (
    <div className="flex flex-col gap-2 items-center">
      <Image
        src={`/avatars/${avatar}.png`}
        width={100}
        height={100}
        alt={avatar}
        className="select-none"
      />
      {pseudo && (
        <p className="text-center text-lg w-[100px] text-ellipsis overflow-hidden whitespace-nowrap">
          {pseudo}
        </p>
      )}
    </div>
  )
}

export default UserAvatar
