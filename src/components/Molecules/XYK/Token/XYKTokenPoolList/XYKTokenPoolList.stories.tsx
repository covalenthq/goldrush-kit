import { type Meta, type StoryObj } from "@storybook/react";
import { XYKTokenPoolList as XYKTokenPoolListComponent } from "./XYKTokenPoolList";
import { storyAction } from "@/utils/functions";

type Story = StoryObj<typeof XYKTokenPoolListComponent>;

const meta: Meta<typeof XYKTokenPoolListComponent> = {
    title: "Molecules/XYK/Token/XYK Token Pool List",
    component: XYKTokenPoolListComponent,
};

export default meta;

export const XYKTokenPoolList: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
        token_address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        actionable_pool: (address: string) => storyAction(address),
    },
};
