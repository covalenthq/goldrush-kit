import { Timestamp as TimestampComponent } from "./Timestamp";
import { type Meta, type StoryObj } from "@storybook/react";

const meta: Meta<typeof TimestampComponent> = {
    title: "Atoms/Timestamp",
    component: TimestampComponent,
};

export default meta;

type Story = StoryObj<typeof TimestampComponent>;

export const Timestamp: Story = {
    args: {
        timestamp: new Date(),
        defaultType: "relative",
    },
};
