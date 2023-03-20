import React from "react"

import { Select } from "ui"
import { Meta, Story } from "@storybook/react"

const meta: Meta = {
  title: "Select",
  component: Select,
}

const Template: Story = (args) => <Select {...args} options={args.options} />

export const standard = Template.bind({})
standard.args = {
  label: "Select your gamemode",
  options: [
    { name: "Tic Tac Toe", value: "tic-tac-toe" },
    { name: "Connect 4", value: "connect-four" },
  ],
  size: "normal",
  error: "",
}

export default meta
