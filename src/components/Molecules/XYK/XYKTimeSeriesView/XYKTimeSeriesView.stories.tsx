import { type Meta, type StoryObj } from "@storybook/react";
import { XYKTimeSeriesView } from "./XYKTimeSeriesView";

type Story = StoryObj<typeof XYKTimeSeriesView>;

const meta: Meta<typeof XYKTimeSeriesView> = {
    title: "Molecules/XYK",
    component: XYKTimeSeriesView,
};

export default meta;

export const XYKTimeSeries: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
        address: "0x02af166a28393809f55bb5befbcc27ec15908241",
    },
};
