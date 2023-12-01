import { type Meta, type StoryObj } from "@storybook/react";
import { NFTWalletTokenListView } from "./NFTWalletTokenListView";

type Story = StoryObj<typeof NFTWalletTokenListView>;

const meta: Meta<typeof NFTWalletTokenListView> = {
    title: "Organisms/NFTs",
    component: NFTWalletTokenListView,
};

export default meta;

export const NFTWalletTokenList: Story = {
    args: {
        chain_name: "eth-mainnet",
        address: "pratik.eth",
    },
};
