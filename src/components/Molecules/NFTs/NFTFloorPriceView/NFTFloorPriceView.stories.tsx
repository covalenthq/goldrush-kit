import { type Meta, type StoryObj } from "@storybook/react";
import { NFTFloorPriceView } from "./NFTFloorPriceView";
import { NFT_COLLECTIONS } from "@/utils/constants/shared.constants";

type Story = StoryObj<typeof NFTFloorPriceView>;

const meta: Meta<typeof NFTFloorPriceView> = {
    title: "Molecules/NFTs",
    component: NFTFloorPriceView,
};

export default meta;

export const NFTFloorPrice: Story = {
    args: {
        chain_name: "eth-mainnet",
        collection_address: NFT_COLLECTIONS["BAYC"],
    },
};
