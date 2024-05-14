import { type Meta, type StoryObj } from "@storybook/react";
import { NFTCollectionView as NFTCollectionViewComponent } from "./NFTCollectionView";

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
    },
};
