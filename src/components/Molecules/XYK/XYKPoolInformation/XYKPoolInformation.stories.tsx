import { type Meta, type StoryObj } from "@storybook/react";
import { XYKPoolInformation as XYKPoolInformationComponent } from "./XYKPoolInformation";

type Story = StoryObj<typeof XYKPoolInformationComponent>;

const meta: Meta<typeof XYKPoolInformationComponent> = {
    title: "Molecules/XYK/Pool",
    component: XYKPoolInformationComponent,
};

export default meta;

export const XYKPoolInformation: Story = {
    args: {
        pool_address: "0x21b8065d10f73ee2e260e5b47d3344d3ced7596e",
        dex_name: "uniswap_v2",
        chain_name: "eth-mainnet",
    },
};
