import { type Meta, type StoryObj } from "@storybook/react";
import { XYKTokenTimeSeries as XYKTokenTimeSeriesComponent } from "./XYKTokenTimeSeries";

type Story = StoryObj<typeof XYKTokenTimeSeriesComponent>;

const meta: Meta<typeof XYKTokenTimeSeriesComponent> = {
    title: "Molecules/XYK",
    component: XYKTokenTimeSeriesComponent,
};

export default meta;

export const XYKTokenTimeSeries: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
        token_address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    },
};
