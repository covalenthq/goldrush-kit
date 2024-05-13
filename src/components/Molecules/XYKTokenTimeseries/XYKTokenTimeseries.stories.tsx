import { type Meta, type StoryObj } from "@storybook/react";
import { XYKTokenTimeseries as XYKTokenTimeseriesComponent } from "./XYKTokenTimeseries";

type Story = StoryObj<typeof XYKTokenTimeseriesComponent>;

const meta: Meta<typeof XYKTokenTimeseriesComponent> = {
    title: "Molecules/XYK Token Timeseries",
    component: XYKTokenTimeseriesComponent,
};

export default meta;

export const XYKTokenTimeseries: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
        token_address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    },
};
