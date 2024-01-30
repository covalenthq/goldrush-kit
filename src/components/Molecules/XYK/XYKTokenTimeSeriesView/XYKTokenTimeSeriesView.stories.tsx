import { type Meta, type StoryObj } from "@storybook/react";
import { XYKTokenTimeSeriesView } from "./XYKTokenTimeSeriesView";

type Story = StoryObj<typeof XYKTokenTimeSeriesView>;

const meta: Meta<typeof XYKTokenTimeSeriesView> = {
    title: "Molecules/XYK",
    component: XYKTokenTimeSeriesView,
};

export default meta;

export const XYKTokenTimeSeries: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
        token_address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    },
};
