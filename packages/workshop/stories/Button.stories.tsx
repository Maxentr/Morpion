import React from "react"
import { Meta, Story } from "@storybook/react"
import { Button } from "ui-web"

const meta: Meta = {
  title: "Button",
  component: Button,
  argTypes: {
    label: { control: "text" },
  },
}

const Template: Story = (args) => <Button label={args.label} {...args} />

export const Primary = Template.bind({})
Primary.args = {
  label: "Button",
}

export default meta
