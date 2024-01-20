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
        wallet_address: "0xfc43f5f9dd45258b3aff31bdbe6561d97e8b71de",
    },
};
