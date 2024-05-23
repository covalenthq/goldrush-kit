import { type Meta, type StoryObj } from "@storybook/react";
import { XYKWalletPositionsList as XYKWalletPositionsListComponent } from "./XYKWalletPositionsList";
import { storyAction } from "@/utils/functions";

type Story = StoryObj<typeof XYKWalletPositionsListComponent>;

const meta: Meta<typeof XYKWalletPositionsListComponent> = {
    title: "Molecules/XYK/Wallet/XYK Wallet Positions List",
    component: XYKWalletPositionsListComponent,
};

export default meta;

export const XYKWalletPositionsList: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
        wallet_address: "0xfC43f5F9dd45258b3AFf31Bdbe6561D97e8B71de",
        actionable_pool: (address: string) => storyAction(address),
    },
};
