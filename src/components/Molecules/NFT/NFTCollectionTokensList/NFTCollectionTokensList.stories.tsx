import { NFTCollectionTokensList as NFTCollectionTokensListComponent } from "./NFTCollectionTokensList";
import { type Meta, type StoryObj } from "@storybook/react";

type Story = StoryObj<typeof NFTCollectionTokensListComponent>;

const meta: Meta<typeof NFTCollectionTokensListComponent> = {
    title: "Molecules/NFT/NFT Collection Tokens List",
    component: NFTCollectionTokensListComponent,
};

export default meta;

export const NFTCollectionTokensList: Story = {
    args: {
        chain_name: "eth-mainnet",
        collection_address: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
    },
};
