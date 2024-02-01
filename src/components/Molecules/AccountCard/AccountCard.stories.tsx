import { type Meta, type StoryObj } from "@storybook/react";
import { AccountCard as AccountCardComponent } from "./AccountCard";

type Story = StoryObj<typeof AccountCardComponent>;

const meta: Meta<typeof AccountCardComponent> = {
    title: "Molecules/Account Card",
    component: AccountCardComponent,
};

export default meta;

export const AccountCard: Story = {
    args: {
        address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
        type: "effigy",
    },
};
