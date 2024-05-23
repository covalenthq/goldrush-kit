import { type Meta, type StoryObj } from "@storybook/react";
import { XYKTokenDetails as XYKTokenDetailsComponent } from "./XYKTokenDetails";
import { fn } from "@storybook/test";

type Story = StoryObj<typeof XYKTokenDetailsComponent>;

const meta: Meta<typeof XYKTokenDetailsComponent> = {
    title: "Molecules/XYK/Token/XYK Token Details",
    component: XYKTokenDetailsComponent,
};

export default meta;

export const XYKTokenDetails: Story = {
    args: {
        token_address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        dex_name: "uniswap_v2",
        chain_name: "eth-mainnet",
        actionable_address: (address: string) => ({
            parent: "button",
            parentProps: {
                onClick: fn(() => {
                    console.log(address);
                }),
                className: "hover:underline",
            },
        }),
    },
};
