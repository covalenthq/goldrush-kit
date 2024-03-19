import { type Meta, type StoryObj } from "@storybook/react";
import { ThemeConfig as ThemeConfigComponent } from "./ThemeConfig";

const meta: Meta<typeof ThemeConfigComponent> = {
    title: "Theme Config",
    component: ThemeConfigComponent,
    argTypes: {},
};
export default meta;

type Story = StoryObj<typeof ThemeConfigComponent>;

export const ThemeConfig: Story = {};
