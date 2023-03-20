import React from "react"

type Props = {
  value: string
}

const ClipboardInput = ({ value }: Props) => {
  const handleClipboard = (e: any) => {
    navigator.clipboard.writeText(value)
    e.target.blur()
    e.target.value = "Copié !"

    setTimeout(() => {
      e.target.value = value
    }, 2000)
  }

  return (
    <input
      type="text"
      className="bg-primary dark:bg-gray-500 text-customBlack dark:text-primary text-center w-full border border-primary dark:border-gray-800 outline-none rounded"
      onClick={handleClipboard}
      defaultValue={value}
    />
  )
}

export default ClipboardInput
