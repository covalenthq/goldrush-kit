import { type Meta, type StoryObj } from "@storybook/react";
import { NFTVolume as NFTVolumeComponent } from "./NFTVolume";
import { NFT_COLLECTIONS } from "@/utils/constants/shared.constants";

type Story = StoryObj<typeof NFTVolumeComponent>;

const meta: Meta<typeof NFTVolumeComponent> = {
    title: "Molecules/NFTs",
    component: NFTVolumeComponent,
};

export default meta;

export const NFTVolume: Story = {
    args: {
        chain_name: "eth-mainnet",
        collection_address: NFT_COLLECTIONS["BAYC"],
    },
};
