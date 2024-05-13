import { type Meta, type StoryObj } from "@storybook/react";
import { XYKWalletDetails as XYKWalletDetailsComponent } from "./XYKWalletDetails";

type Story = StoryObj<typeof XYKWalletDetailsComponent>;

const meta: Meta<typeof XYKWalletDetailsComponent> = {
    title: "Molecules/XYK Wallet Details",
    component: XYKWalletDetailsComponent,
};

export default meta;

export const XYKWalletDetails: Story = {
    args: {
        wallet_address: "0x9efaa5dd8ca7c35978483517146f571240b60042",
        dex_name: "uniswap_v2",
        chain_name: "eth-mainnet",
    },
};
