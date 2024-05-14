import { type Meta, type StoryObj } from "@storybook/react";
import { XYKWalletPositionsListView } from "./XYKWalletPositionsListView";

type Story = StoryObj<typeof XYKWalletPositionsListView>;

const meta: Meta<typeof XYKWalletPositionsListView> = {
    title: "Organisms",
    component: XYKWalletPositionsListView,
};

export default meta;

export const XYKWalletPositionsList: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
        wallet_address: "0xfC43f5F9dd45258b3AFf31Bdbe6561D97e8B71de",
    },
};
