import React from "react"

import { Input } from "ui"
import { Meta, Story } from "@storybook/react"

const meta: Meta = {
  title: "Input",
  component: Input,
}

const Template: Story = (args) => <Input {...args} size={args.size} />

export const standard = Template.bind({})
standard.args = {
  label: "Email",
  type: "email",
  name: "email",
  id: "email",
  size: "normal",
  error: "This field is required",
}

export default meta
