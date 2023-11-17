import { type Meta, type StoryObj } from "@storybook/react";
import { NFTDetailView } from "./NFTDetailView";

type Story = StoryObj<typeof NFTDetailView>;

const meta: Meta<typeof NFTDetailView> = {
    title: "Organisms/NFTs",
    component: NFTDetailView,
};

export default meta;

export const NFTDetail: Story = {
    args: {
        chain_name: "eth-mainnet",
        collection_address: "0xe785e82358879f061bc3dcac6f0444462d4b5330",
        token_id: "5565",
    },
};
