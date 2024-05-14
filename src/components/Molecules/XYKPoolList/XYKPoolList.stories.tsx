import { type Meta, type StoryObj } from "@storybook/react";
import { XYKPoolList as XYKPoolListComponent } from "./XYKPoolList";

type Story = StoryObj<typeof XYKPoolListComponent>;

const meta: Meta<typeof XYKPoolListComponent> = {
    title: "Molecules/XYK Pool List",
    component: XYKPoolListComponent,
};

export default meta;

export const XYKPoolList: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
    },
};
