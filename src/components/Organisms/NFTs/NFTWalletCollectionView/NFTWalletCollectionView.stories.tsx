import { type Meta, type StoryObj } from "@storybook/react";
import { NFTWalletCollectionView } from "./NFTWalletCollectionView";

type Story = StoryObj<typeof NFTWalletCollectionView>;

const meta: Meta<typeof NFTWalletCollectionView> = {
    title: "Organisms/NFTs",
    component: NFTWalletCollectionView,
};

export default meta;

export const NFTWalletCollectionList: Story = {
    args: {
        chain_name: "eth-mainnet",
        address: "0x1ae705a28f1cca0363b5d709159220aa2fe551de",
    },
};
