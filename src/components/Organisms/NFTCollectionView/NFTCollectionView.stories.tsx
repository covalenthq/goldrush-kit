import { NFTCollectionView as NFTCollectionViewComponent } from "./NFTCollectionView";
import { storyAction } from "@/utils/functions";
import { type Meta, type StoryObj } from "@storybook/react";

type Story = StoryObj<typeof NFTCollectionViewComponent>;

const meta: Meta<typeof NFTCollectionViewComponent> = {
    title: "Organisms/NFT Collection View",
    component: NFTCollectionViewComponent,
};

export default meta;

export const NFTCollectionView: Story = {
    args: {
        chain_name: "eth-mainnet",
        collection_address: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
        actionable_address: (address: string) => storyAction(address),
    },
};
