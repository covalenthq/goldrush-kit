import { type Meta, type StoryObj } from "@storybook/react";
import { LatestTransactions as LatestTransactionsComponent } from "./LatestTransactions";
import { fn } from "@storybook/test";

type Story = StoryObj<typeof LatestTransactionsComponent>;

const meta: Meta<typeof LatestTransactionsComponent> = {
    title: "Molecules/Transaction/Latest Transactions",
    component: LatestTransactionsComponent,
};

export default meta;

export const LatestTransactions: Story = {
    args: {
        chain_name: "eth-mainnet",
        actionable_transaction: (address) => ({
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
