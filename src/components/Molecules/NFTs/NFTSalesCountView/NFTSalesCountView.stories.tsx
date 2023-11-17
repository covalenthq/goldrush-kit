import { type Meta, type StoryObj } from "@storybook/react";
import { NFTSalesCountView } from "./NFTSalesCountView";
import { NFT_COLLECTIONS } from "@/utils/constants/shared.constants";

type Story = StoryObj<typeof NFTSalesCountView>;

const meta: Meta<typeof NFTSalesCountView> = {
    title: "Molecules/NFTs",
    component: NFTSalesCountView,
};

export default meta;

export const NFTSalesCount: Story = {
    args: {
        chain_name: "eth-mainnet",
        collection_address: NFT_COLLECTIONS["BAYC"],
    },
};
