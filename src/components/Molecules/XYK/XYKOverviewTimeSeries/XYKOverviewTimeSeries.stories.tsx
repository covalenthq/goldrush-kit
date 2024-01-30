import { type Meta, type StoryObj } from "@storybook/react";
import { XYKOverviewTimeSeries as XYKOverviewTimeSeriesComponent } from "./XYKOverviewTimeSeries";

type Story = StoryObj<typeof XYKOverviewTimeSeriesComponent>;

const meta: Meta<typeof XYKOverviewTimeSeriesComponent> = {
    title: "Molecules/XYK",
    component: XYKOverviewTimeSeriesComponent,
};

export default meta;

export const XYKOverviewTimeSeries: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
    },
};
