import { type Meta, type StoryObj } from "@storybook/react";
import { XYKTokenInformation as XYKTokenInformationComponent } from "./XYKTokenInformation";

type Story = StoryObj<typeof XYKTokenInformationComponent>;

const meta: Meta<typeof XYKTokenInformationComponent> = {
    title: "Molecules/XYK/Token",
    component: XYKTokenInformationComponent,
};

export default meta;

export const XYKTokenInformation: Story = {
    args: {
        token_address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        dex_name: "uniswap_v2",
        chain_name: "eth-mainnet",
    },
};
