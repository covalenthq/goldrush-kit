import { type Meta, type StoryObj } from "@storybook/react";
import { DecodedTransaction } from "./DecodedTransaction";
import { TypographyH1 } from "@/components/ui/typography";

type Story = StoryObj<typeof DecodedTransaction>;

const meta: Meta<typeof DecodedTransaction> = {
    title: "Molecules/DecodedTransactions",
    component: DecodedTransaction,
    argTypes: {
        setMetadata: {
            control: false,
            table: {
                disable: true,
            },
        },
    },
    render: ({ chain_name, tx_hash, setMetadata }) => (
        <section>
            <div className="mb-8">
                <TypographyH1>Decoded Transaction</TypographyH1>
            </div>

            <DecodedTransaction
                chain_name={chain_name}
                tx_hash={tx_hash}
                setMetadata={setMetadata}
            />
        </section>
    ),
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
