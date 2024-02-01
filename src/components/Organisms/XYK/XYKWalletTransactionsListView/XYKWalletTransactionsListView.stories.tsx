import { type Meta, type StoryObj } from "@storybook/react";
import { XYKWalletTransactionsListView } from "./XYKWalletTransactionsListView";

type Story = StoryObj<typeof XYKWalletTransactionsListView>;

const meta: Meta<typeof XYKWalletTransactionsListView> = {
    title: "Organisms/XYK/Wallet",
    component: XYKWalletTransactionsListView,
};

export default meta;

export const XYKWalletTransactionsList: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
        wallet_address: "0xfC43f5F9dd45258b3AFf31Bdbe6561D97e8B71de",
    },
};
