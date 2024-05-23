import { type Meta, type StoryObj } from "@storybook/react";
import { TokenBalancesList as TokenBalancesListComponent } from "./TokenBalancesList";
import { type CrossChainBalanceItem } from "@/utils/types/molecules.types";
import { fn } from "@storybook/test";

type Story = StoryObj<typeof TokenBalancesListComponent>;

const meta: Meta<typeof TokenBalancesListComponent> = {
    title: "Molecules/Token/Token Balances List",
    component: TokenBalancesListComponent,
};

export default meta;

export const TokenBalancesList: Story = {
    args: {
        chain_names: ["eth-mainnet", "matic-mainnet", "bsc-mainnet"],
        address: "0xf8cb94cda3552a427b87d8beb04729beb93dac5c",
        mask_balances: false,
        hide_small_balances: false,
        actionable_token: (token: CrossChainBalanceItem) => ({
            parent: "button",
            parentProps: {
                onClick: fn(() => {
                    console.log(token);
                }),
            },
        }),
    },
};
