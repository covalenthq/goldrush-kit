import { type Meta, type StoryObj } from "@storybook/react";
import { AccountCardView } from "./AccountCardView";

type Story = StoryObj<typeof AccountCardView>;

const meta: Meta<typeof AccountCardView> = {
    title: "Molecules",
    component: AccountCardView,
};

export default meta;

export const AccountCard: Story = {
    args: {
        address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
        type: "effigy",
    },
};
