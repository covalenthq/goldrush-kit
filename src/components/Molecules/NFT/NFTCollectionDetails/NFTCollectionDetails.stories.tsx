import { type Meta, type StoryObj } from "@storybook/react";
import { NFTCollectionDetails as NFYCollectionDetailsComponent } from "./NFTCollectionDetails";

type Story = StoryObj<typeof NFYCollectionDetailsComponent>;

const meta: Meta<typeof NFYCollectionDetailsComponent> = {
    title: "Molecules/NFT/NFT Collection Details",
    component: NFYCollectionDetailsComponent,
};

export default meta;

export const NFTCollectionDetails: Story = {
    args: {
        chain_name: "eth-mainnet",
        collection_address: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
    },
};
