import { type Meta, type StoryObj } from "@storybook/react";
import { NFTWalletCollectionView as NFTWalletCollectionViewComponent } from "./NFTWalletCollectionView";

type Story = StoryObj<typeof NFTWalletCollectionViewComponent>;

const meta: Meta<typeof NFTWalletCollectionViewComponent> = {
    title: "Organisms",
    component: NFTWalletCollectionViewComponent,
};

export default meta;

export const NFTWalletCollectionView: Story = {
    args: {
        chain_name: "eth-mainnet",
        address: "0x1ae705a28f1cca0363b5d709159220aa2fe551de",
    },
};
