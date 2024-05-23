import { type Meta, type StoryObj } from "@storybook/react";
import { XYKPoolDetails as XYKPoolDetailsComponent } from "./XYKPoolDetails";
import { fn } from "@storybook/test";

type Story = StoryObj<typeof XYKPoolDetailsComponent>;

const meta: Meta<typeof XYKPoolDetailsComponent> = {
    title: "Molecules/XYK/Pool/XYK Pool Details",
    component: XYKPoolDetailsComponent,
};

export default meta;

export const XYKPoolDetails: Story = {
    args: {
        pool_address: "0x21b8065d10f73ee2e260e5b47d3344d3ced7596e",
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
        actionable_token_0: (address: string) => ({
            parent: "button",
            parentProps: {
                onClick: fn(() => {
                    console.log(address);
                }),
                className: "hover:underline",
            },
        }),
        actionable_token_1: (address: string) => ({
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
