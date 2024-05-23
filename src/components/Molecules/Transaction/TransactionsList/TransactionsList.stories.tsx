import { type Meta, type StoryObj } from "@storybook/react";
import { TransactionsList as TransactionsListComponent } from "./TransactionsList";
import { fn } from "@storybook/test";

type Story = StoryObj<typeof TransactionsListComponent>;

const meta: Meta<typeof TransactionsListComponent> = {
    title: "Molecules/Transaction/Transactions List",
    component: TransactionsListComponent,
};

export default meta;

export const TransactionsList: Story = {
    args: {
        chain_name: "eth-mainnet",
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
