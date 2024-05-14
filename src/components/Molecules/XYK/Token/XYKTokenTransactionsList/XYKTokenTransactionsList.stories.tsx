import { type Meta, type StoryObj } from "@storybook/react";
import { XYKTokenTransactionsList as XYKTokenTransactionsListComponent } from "./XYKTokenTransactionsList";

type Story = StoryObj<typeof XYKTokenTransactionsListComponent>;

const meta: Meta<typeof XYKTokenTransactionsListComponent> = {
    title: "Molecules/XYK/Token/XYK Token Transactions List",
    component: XYKTokenTransactionsListComponent,
};

export default meta;

export const XYKTokenTransactionsList: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
        token_address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    },
};
