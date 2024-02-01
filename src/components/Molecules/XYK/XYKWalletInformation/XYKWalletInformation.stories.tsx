import { type Meta, type StoryObj } from "@storybook/react";
import { XYKWalletInformation as XYKWalletInformationComponent } from "./XYKWalletInformation";

type Story = StoryObj<typeof XYKWalletInformationComponent>;

const meta: Meta<typeof XYKWalletInformationComponent> = {
    title: "Molecules/XYK",
    component: XYKWalletInformationComponent,
};

export default meta;

export const XYKWalletInformation: Story = {
    args: {
        wallet_address: "0x9efaa5dd8ca7c35978483517146f571240b60042",
        dex_name: "uniswap_v2",
        chain_name: "eth-mainnet",
    },
};
