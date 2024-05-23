import { type Meta, type StoryObj } from "@storybook/react";
import { Pool as PoolComponent } from "./Pool";

const meta: Meta<typeof PoolComponent> = {
    title: "Atoms/Pool",
    component: PoolComponent,
};

export default meta;

type Story = StoryObj<typeof PoolComponent>;

export const Pool: Story = {
    args: {
        token_0_logo_url:
            "https://logos.covalenthq.com/tokens/1/0x66a0f676479cee1d7373f3dc2e2952778bff5bd6.png",
        token_0_ticker_symbol: "WISE",
        token_1_logo_url:
            "https://logos.covalenthq.com/tokens/1/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
        token_1_ticker_symbol: "WETH",
        pool_address: "0x66a0f676479cee1d7373f3dc2e2952778bff5bd6",
    },
};
