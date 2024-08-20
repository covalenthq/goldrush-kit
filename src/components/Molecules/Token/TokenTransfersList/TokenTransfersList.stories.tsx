import { TokenTransfersList as TokenTransfersListComponent } from "./TokenTransfersList";
import { storyAction } from "@/utils/functions";
import { type Meta, type StoryObj } from "@storybook/react";

type Story = StoryObj<typeof TokenTransfersListComponent>;

const meta: Meta<typeof TokenTransfersListComponent> = {
    title: "Molecules/Token/Token Transfers List",
    component: TokenTransfersListComponent,
};

export default meta;

export const TokenTransfersList: Story = {
    args: {
        chain_name: "eth-mainnet",
        address: "0x1dc3bcc07b93c73c476d7e1056b64c8bd947184a",
        contract_address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        actionable_from: (address) => storyAction(address),
        actionable_to: (address) => storyAction(address),
    },
};
