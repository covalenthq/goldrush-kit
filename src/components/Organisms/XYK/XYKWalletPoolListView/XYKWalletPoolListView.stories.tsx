import { type Meta, type StoryObj } from "@storybook/react";
import { XYKWalletPoolListView } from "./XYKWalletPoolListView";

type Story = StoryObj<typeof XYKWalletPoolListView>;

const meta: Meta<typeof XYKWalletPoolListView> = {
    title: "Organisms/XYK/Wallet",
    component: XYKWalletPoolListView,
};

export default meta;

export const XYKWalletPoolList: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
        wallet_address: "0xfC43f5F9dd45258b3AFf31Bdbe6561D97e8B71de",
    },
};
