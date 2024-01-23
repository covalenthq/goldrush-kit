import { type Meta, type StoryObj } from "@storybook/react";
import { XYKOverviewLiquidityView } from "./XYKOverviewLiquidityView";

type Story = StoryObj<typeof XYKOverviewLiquidityView>;

const meta: Meta<typeof XYKOverviewLiquidityView> = {
    title: "Molecules/XYK",
    component: XYKOverviewLiquidityView,
};

export default meta;

export const XYKOverviewLiquidity: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
    },
};
