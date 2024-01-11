import { type Meta, type StoryObj } from "@storybook/react";
import { XYKPoolTimeSeriesView } from "./XYKPoolTimeSeriesView";

type Story = StoryObj<typeof XYKPoolTimeSeriesView>;

const meta: Meta<typeof XYKPoolTimeSeriesView> = {
    title: "Molecules/XYK",
    component: XYKPoolTimeSeriesView,
};

export default meta;

export const XYKPoolTimeSeries: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
        pool_address: "0x02af166a28393809f55bb5befbcc27ec15908241",
    },
};
