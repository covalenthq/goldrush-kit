import { type Meta, type StoryObj } from "@storybook/react";
import { CollectionCard as CollectionCardComponent } from "./CollectionCard";

type Story = StoryObj<typeof CollectionCardComponent>;

const meta: Meta<typeof CollectionCardComponent> = {
    title: "Molecules/Collection Card",
    component: CollectionCardComponent,
};

export default meta;

export const CollectionCard: Story = {
    args: {
        collection_address: "0xe785e82358879f061bc3dcac6f0444462d4b5330",
        chain_name: "eth-mainnet",
    },
};
