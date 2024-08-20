import { ThemeConfig as ThemeConfigComponent } from "./ThemeConfig";
import { type Meta, type StoryObj } from "@storybook/react";

const meta: Meta<typeof ThemeConfigComponent> = {
    title: "Theme Config",
    component: ThemeConfigComponent,
    argTypes: {},
};
export default meta;

type Story = StoryObj<typeof ThemeConfigComponent>;

export const ThemeConfig: Story = {};
