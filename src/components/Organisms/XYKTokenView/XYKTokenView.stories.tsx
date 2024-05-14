import { type Meta, type StoryObj } from "@storybook/react";
import { XYKTokenView as XYKTokenViewComponent } from "./XYKTokenView";

type Story = StoryObj<typeof XYKTokenViewComponent>;

const meta: Meta<typeof XYKTokenViewComponent> = {
    title: "Organisms/XYK Token View",
    component: XYKTokenViewComponent,
};

export default meta;

export const XYKTokenView: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
        token_address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    },
};
