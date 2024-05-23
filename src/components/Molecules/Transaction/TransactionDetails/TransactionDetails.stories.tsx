import { type Meta, type StoryObj } from "@storybook/react";
import { TransactionDetails as TransactionDetailsComponent } from "./TransactionDetails";
import { fn } from "@storybook/test";

type Story = StoryObj<typeof TransactionDetailsComponent>;

const meta: Meta<typeof TransactionDetailsComponent> = {
    title: "Molecules/Transaction/Transaction Details",
    component: TransactionDetailsComponent,
};

export default meta;

export const TransactionDetails: Story = {
    args: {
        chain_name: "eth-mainnet",
        tx_hash:
            "0x7a038d2f5be4d196a3ff389497f8d61a639e4a32d353758b4f062cafbc5d475c",
        actionable_block: (block: number) => ({
            parent: "button",
            parentProps: {
                onClick: fn(() => {
                    console.log(block);
                }),
            },
        }),
        actionable_transaction: (address: string) => ({
            parent: "button",
            parentProps: {
                onClick: fn(() => {
                    console.log(address);
                }),
                className: "hover:underline",
            },
        }),
        actionable_from: (address) => ({
            parent: "button",
            parentProps: {
                onClick: fn(() => {
                    console.log(address);
                }),
                className: "hover:underline",
            },
        }),
        actionable_to: (address) => ({
            parent: "button",
            parentProps: {
                onClick: fn(() => {
                    console.log(address);
                }),
                className: "hover:underline",
            },
        }),
    },
};
