import { type Meta, type StoryObj } from "@storybook/react";
import { ThemeConfigView } from "./ThemeConfigView";

const meta: Meta<typeof ThemeConfigView> = {
    title: "Theme Config",
    component: ThemeConfigView,
    argTypes: {
        default_color: {
            options: [
                "slate",
                "stone",
                "red",
                "orange",
                "amber",
                "yellow",
                "lime",
                "green",
                "emerald",
                "cyan",
                "sky",
                "blue",
                "indigo",
                "violet",
                "purple",
                "fuchsia",
                "pink",
                "rose",
            ],
            control: { type: "radio" },
        },
        border_radius: {
            options: ["none", "small", "medium", "large", "full"],
            control: { type: "radio" },
        },
    },
};
export default meta;

type Story = StoryObj<typeof ThemeConfigView>;

export const ThemeConfig: Story = {
    args: {
        default_color: "red",
        border_radius: "medium",
    },
};
