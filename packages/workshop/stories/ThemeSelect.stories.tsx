import React from "react"
import { Meta, Story } from "@storybook/react"
import ThemeSelect from "ui/src/ThemeSelect"

const meta: Meta = {
  title: "Theme Select",
  component: ThemeSelect,
}

const Template: Story = (args) => (
  <div className="ml-8">

  <ThemeSelect value={args.value} onChange={args.onChange} />
  </div>
)

export const Primary = Template.bind({})
Primary.args = {
  value: "light",
  onChange: () => {},
}

export default meta
