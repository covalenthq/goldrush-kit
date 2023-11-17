import { type Meta, type StoryObj } from "@storybook/react";
import { NFTVolumeView } from "./NFTVolumeView";
import { NFT_COLLECTIONS } from "@/utils/constants/shared.constants";

type Story = StoryObj<typeof NFTVolumeView>;

const meta: Meta<typeof NFTVolumeView> = {
    title: "Molecules/NFTs",
    component: NFTVolumeView,
};

export default meta;

export const NFTVolume: Story = {
    args: {
        chain_name: "eth-mainnet",
        collection_address: NFT_COLLECTIONS["BAYC"],
    },
};
