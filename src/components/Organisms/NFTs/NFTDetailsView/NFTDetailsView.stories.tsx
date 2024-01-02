import { type Meta, type StoryObj } from "@storybook/react";
import { NFTDetailsView } from "./NFTDetailsView";

type Story = StoryObj<typeof NFTDetailsView>;

const meta: Meta<typeof NFTDetailsView> = {
    title: "Organisms/NFTs",
    component: NFTDetailsView,
};

export default meta;

export const NFTDetails: Story = {
    args: {
        chain_name: "eth-mainnet",
        collection_address: "0xe785e82358879f061bc3dcac6f0444462d4b5330",
        token_id: "5565",
    },
};
