import { type Meta, type StoryObj } from "@storybook/react";
import { NFTDetailsView as NFTDetailsViewComponent } from "./NFTDetailsView";

type Story = StoryObj<typeof NFTDetailsViewComponent>;

const meta: Meta<typeof NFTDetailsViewComponent> = {
    title: "Organisms/NFT Details View",
    component: NFTDetailsViewComponent,
};

export default meta;

export const NFTDetailsView: Story = {
    args: {
        chain_name: "eth-mainnet",
        collection_address: "0xe785e82358879f061bc3dcac6f0444462d4b5330",
        token_id: "5565",
    },
};
