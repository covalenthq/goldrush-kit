import { type Meta, type StoryObj } from "@storybook/react";
import { Timestamp as TimestampComponent } from "./Timestamp";

const meta: Meta<typeof TimestampComponent> = {
    title: "Atoms/Timestamp",
    component: TimestampComponent,
};

export default meta;

type Story = StoryObj<typeof TimestampComponent>;

export const Timestamp: Story = {
    args: {
        timestamp: new Date(),
        defaultType: "descriptive",
    },
};
