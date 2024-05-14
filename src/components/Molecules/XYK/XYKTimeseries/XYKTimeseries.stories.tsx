import { type Meta, type StoryObj } from "@storybook/react";
import { XYKTimeseries as XYKTimeseriesComponent } from "./XYKTimeseries";

type Story = StoryObj<typeof XYKTimeseriesComponent>;

const meta: Meta<typeof XYKTimeseriesComponent> = {
    title: "Molecules/XYK/XYK Timeseries",
    component: XYKTimeseriesComponent,
};

export default meta;

export const XYKTimeseries: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
    },
};
