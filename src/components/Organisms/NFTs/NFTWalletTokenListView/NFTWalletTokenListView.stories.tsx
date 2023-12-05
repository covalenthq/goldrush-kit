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
        chain_names: ["eth-mainnet"],
        address: "0x1ae705a28f1cca0363b5d709159220aa2fe551de",
    },
};

export const MultiChainNFTWalletTokenList: Story = {
    args: {
        chain_names: [
            "eth-mainnet",
            "matic-mainnet",
            "bsc-mainnet",
            "avalanche-mainnet",
            "optimism-mainnet",
        ],
        address: "0x1ae705a28f1cca0363b5d709159220aa2fe551de",
    },
};
