import { type Meta, type StoryObj } from "@storybook/react";
import { MultiChainAssetCardView } from "./MultiChainAssetCardView";

type Story = StoryObj<typeof MultiChainAssetCardView>;

const meta: Meta<typeof MultiChainAssetCardView> = {
    title: "Molecules",
    component: MultiChainAssetCardView,
};

export default meta;

export const MultiChainAssetCard: Story = {
    args: {
        chain_names: ["eth-mainnet","matic-mainnet"],
        wallet_address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
        variant: "donut",
        has_legend: true,
    },
};