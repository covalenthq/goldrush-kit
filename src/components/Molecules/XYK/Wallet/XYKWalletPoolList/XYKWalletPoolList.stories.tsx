import { type Meta, type StoryObj } from "@storybook/react";
import { XYKWalletPoolList as XYKWalletPoolListComponent } from "./XYKWalletPoolList";
import { storyAction } from "@/utils/functions";

type Story = StoryObj<typeof XYKWalletPoolListComponent>;

const meta: Meta<typeof XYKWalletPoolListComponent> = {
    title: "Molecules/XYK/Wallet/XYK Wallet Pool List",
    component: XYKWalletPoolListComponent,
};

export default meta;

export const XYKWalletPoolList: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
        wallet_address: "0xfC43f5F9dd45258b3AFf31Bdbe6561D97e8B71de",
        actionable_pool: (address: string) => storyAction(address),
    },
};
