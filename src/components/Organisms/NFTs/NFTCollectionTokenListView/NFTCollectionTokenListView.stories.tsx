import { type Meta, type StoryObj } from "@storybook/react";
import { NFTCollectionTokenListView } from "./NFTCollectionTokenListView";

type Story = StoryObj<typeof NFTCollectionTokenListView>;

const meta: Meta<typeof NFTCollectionTokenListView> = {
    title: "Organisms/NFTs",
    component: NFTCollectionTokenListView,
};

export default meta;

export const NFTCollectionTokenList: Story = {
    args: {
        chain_name: "eth-mainnet",
        collection_address: "0xe785e82358879f061bc3dcac6f0444462d4b5330",
    },
};