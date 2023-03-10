import React from "react"
import { Meta, Story } from "@storybook/react"
import { Button } from "ui"

const meta: Meta = {
  title: "Button",
  component: Button,
}

const Template: Story = (args) => (
  <Button label={args.label} variant={args.variant} color={args.color} size={args.size} loading={args.loading} />
)

export const Primary = Template.bind({})
Primary.args = {
  label: "Button",
  variant: "filled",
  color: "primary",
  size: "normal",
}

export default meta
