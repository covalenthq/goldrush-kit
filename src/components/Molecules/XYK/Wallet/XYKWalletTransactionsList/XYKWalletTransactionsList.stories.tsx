import { type Meta, type StoryObj } from "@storybook/react";
import { XYKWalletTransactionsList as XYKWalletTransactionsListComponent } from "./XYKWalletTransactionsList";

type Story = StoryObj<typeof XYKWalletTransactionsListComponent>;

const meta: Meta<typeof XYKWalletTransactionsListComponent> = {
    title: "Molecules/XYK/Wallet/XYK Wallet Transactions List",
    component: XYKWalletTransactionsListComponent,
};

export default meta;

export const XYKWalletTransactionsList: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
        wallet_address: "0xfC43f5F9dd45258b3AFf31Bdbe6561D97e8B71de",
    },
};
