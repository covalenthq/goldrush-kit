import { type Meta, type StoryObj } from "@storybook/react";
import { DecodedTransactionView } from "./DecodedTransactionView";

type Story = StoryObj<typeof DecodedTransactionView>;

const meta: Meta<typeof DecodedTransactionView> = {
    title: "Molecules/DecodedTransactions",
    component: DecodedTransactionView,
};

export default meta;

export const TokensTransaction: Story = {
    args: {
        chain_name: "eth-mainnet",
        tx_hash:
            "0x7c0d75a2c4407917a0f70c48655f8a66f35f9aba7d36e615bcabc2c191ac2658",
    },
};

export const NFTSTransaction: Story = {
    args: {
        chain_name: "eth-mainnet",
        tx_hash:
            "0x7a038d2f5be4d196a3ff389497f8d61a639e4a32d353758b4f062cafbc5d475c",
    },
};

export const DetailsTransaction: Story = {
    args: {
        chain_name: "moonbeam-mainnet",
        tx_hash:
            "0x34ff300049313fde3ffb055d4fcbea1257fd8ca341c913033ccff6976eb7b231",
    },
};
