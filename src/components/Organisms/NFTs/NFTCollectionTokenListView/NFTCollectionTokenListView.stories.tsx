import { type Meta, type StoryObj } from "@storybook/react";
import { NFTCollectionTokenListView } from "./NFTCollectionTokenListView";

type Story = StoryObj<typeof NFTCollectionTokenListView>;

const meta: Meta<typeof NFTCollectionTokenListView> = {
    title: "Organisms/NFTs",
    component: NFTCollectionTokenListView,
};

export default meta;

export const NFTCollectionTokenList: Story = {
    args: {
        chain_name: "eth-mainnet",
        collection_address: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
    },
};
