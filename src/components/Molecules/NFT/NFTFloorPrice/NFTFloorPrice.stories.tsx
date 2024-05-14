import { type Meta, type StoryObj } from "@storybook/react";
import { NFTFloorPrice as NFTFloorPriceComponent } from "./NFTFloorPrice";
import { NFT_COLLECTIONS } from "@/utils/constants/shared.constants";

type Story = StoryObj<typeof NFTFloorPriceComponent>;

const meta: Meta<typeof NFTFloorPriceComponent> = {
    title: "Molecules/NFT/NFT Floor Price",
    component: NFTFloorPriceComponent,
};

export default meta;

export const NFTFloorPrice: Story = {
    args: {
        chain_name: "eth-mainnet",
        collection_address: NFT_COLLECTIONS["BAYC"],
    },
};
