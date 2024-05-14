import { type Meta, type StoryObj } from "@storybook/react";
import { NFTWalletCollectionDetails as NFTWalletCollectionDetailsComponent } from "./NFTWalletCollectionDetails";

type Story = StoryObj<typeof NFTWalletCollectionDetailsComponent>;

const meta: Meta<typeof NFTWalletCollectionDetailsComponent> = {
    title: "Molecules/NFT Wallet Collection Details",
    component: NFTWalletCollectionDetailsComponent,
};

export default meta;

export const NFTWalletCollectionDetails: Story = {
    args: {
        chain_name: "eth-mainnet",
        address: "0x1ae705a28f1cca0363b5d709159220aa2fe551de",
    },
};
