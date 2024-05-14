import { type Meta, type StoryObj } from "@storybook/react";
import { XYKPoolTimeseries as XYKPoolTimeseriesComponent } from "./XYKPoolTimeseries";

type Story = StoryObj<typeof XYKPoolTimeseriesComponent>;

const meta: Meta<typeof XYKPoolTimeseriesComponent> = {
    title: "Molecules/XYK/Pool/XYK Pool Timeseries",
    component: XYKPoolTimeseriesComponent,
};

export default meta;

export const XYKPoolTimeseries: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
        pool_address: "0x21b8065d10f73ee2e260e5b47d3344d3ced7596e",
    },
};
