import { NFTWalletCollectionList as NFTWalletCollectionListComponent } from "./NFTWalletCollectionList";
import { storyAction } from "@/utils/functions";
import { type Meta, type StoryObj } from "@storybook/react";

type Story = StoryObj<typeof NFTWalletCollectionListComponent>;

const meta: Meta<typeof NFTWalletCollectionListComponent> = {
    title: "Molecules/NFT/NFT Wallet Collection List",
    component: NFTWalletCollectionListComponent,
};

export default meta;

export const NFTWalletCollectionList: Story = {
    args: {
        chain_name: "eth-mainnet",
        address: "0x1ae705a28f1cca0363b5d709159220aa2fe551de",
        actionable_contract: (address) => storyAction(address),
    },
};
