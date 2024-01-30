import { type Meta, type StoryObj } from "@storybook/react";
import { XYKOverviewTimeSeriesView } from "./XYKOverviewTimeSeriesView";

type Story = StoryObj<typeof XYKOverviewTimeSeriesView>;

const meta: Meta<typeof XYKOverviewTimeSeriesView> = {
    title: "Molecules/XYK",
    component: XYKOverviewTimeSeriesView,
};

export default meta;

export const XYKOverviewTimeSeries: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
    },
};
