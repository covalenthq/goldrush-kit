import { type Meta, type StoryObj } from "@storybook/react";
import { XYKPoolTimeSeries as XYKPoolTimeSeriesComponent } from "./XYKPoolTimeSeries";

type Story = StoryObj<typeof XYKPoolTimeSeriesComponent>;

const meta: Meta<typeof XYKPoolTimeSeriesComponent> = {
    title: "Molecules/XYK",
    component: XYKPoolTimeSeriesComponent,
};

export default meta;

export const XYKPoolTimeSeries: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
        pool_address: "0x02af166a28393809f55bb5befbcc27ec15908241",
    },
};
