import { type Meta, type StoryObj } from "@storybook/react";
import { XYKTokenList as XYKTokenListComponent } from "./XYKTokenList";
import { fn } from "@storybook/test";

type Story = StoryObj<typeof XYKTokenListComponent>;

const meta: Meta<typeof XYKTokenListComponent> = {
    title: "Molecules/XYK/Token/XYK Token List",
    component: XYKTokenListComponent,
};

export default meta;

export const XYKTokenList: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
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
