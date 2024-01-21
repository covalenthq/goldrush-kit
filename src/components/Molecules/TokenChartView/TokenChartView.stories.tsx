import { type Meta, type StoryObj } from "@storybook/react";
import { TokenChartView } from "./TokenChartView";

type Story = StoryObj<typeof TokenChartView>;

const meta: Meta<typeof TokenChartView> = {
    title: "Molecules",
    component: TokenChartView,
};

export default meta;

export const TokenChart: Story = {
    args: {
        chain_name: "eth-mainnet",
        address: "0xfc43f5f9dd45258b3aff31bdbe6561d97e8b71de",
    },
};