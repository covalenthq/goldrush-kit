import { type Meta, type StoryObj } from "@storybook/react";
import { CollectionCardView } from "./CollectionCardView";

type Story = StoryObj<typeof CollectionCardView>;

const meta: Meta<typeof CollectionCardView> = {
    title: "Molecules",
    component: CollectionCardView,
};

export default meta;

export const CollectionCard: Story = {
    args: {
        collection_address: "0xe785e82358879f061bc3dcac6f0444462d4b5330",
        chain_name: "eth-mainnet",
    },
};
