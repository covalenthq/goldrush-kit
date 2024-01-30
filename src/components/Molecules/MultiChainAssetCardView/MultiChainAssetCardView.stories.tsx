import { type Meta, type StoryObj } from "@storybook/react";
import { MultiChainAssetCardView } from "../MultiChainAssetCardView/MultiChainAssetCardView";

type Story = StoryObj<typeof MultiChainAssetCardView>;

const meta: Meta<typeof MultiChainAssetCardView> = {
    title: "Molecules",
    component: MultiChainAssetCardView,
};

export default meta;

export const MultiChainAssetCard: Story = {
    args: {
        address: "0xD688F76E844f2982a776cBf59235fa2aB79cF726",
        chains_name: ["avalanche-mainnet","defi-kingdoms-mainnet"],
    },
};
