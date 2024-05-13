import { type Meta, type StoryObj } from "@storybook/react";
import { NFTSalesCount as NFTSalesCountComponent } from "./NFTSalesCount";
import { NFT_COLLECTIONS } from "@/utils/constants/shared.constants";

type Story = StoryObj<typeof NFTSalesCountComponent>;

const meta: Meta<typeof NFTSalesCountComponent> = {
    title: "Molecules/NFT Sales Count",
    component: NFTSalesCountComponent,
};

export default meta;

export const NFTSalesCount: Story = {
    args: {
        chain_name: "eth-mainnet",
        collection_address: NFT_COLLECTIONS["BAYC"],
    },
};
