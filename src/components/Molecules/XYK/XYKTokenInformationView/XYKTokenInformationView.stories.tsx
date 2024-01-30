import { type Meta, type StoryObj } from "@storybook/react";
import { XYKTokenInformationView } from "./XYKTokenInformationView";

type Story = StoryObj<typeof XYKTokenInformationView>;

const meta: Meta<typeof XYKTokenInformationView> = {
    title: "Molecules/XYK",
    component: XYKTokenInformationView,
};

export default meta;

export const XYKTokenInformation: Story = {
    args: {
        token_address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        dex_name: "uniswap_v2",
        chain_name: "eth-mainnet",
    },
};
