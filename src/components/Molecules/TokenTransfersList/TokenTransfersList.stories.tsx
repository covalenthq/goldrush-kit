import { type Meta, type StoryObj } from "@storybook/react";
import { TokenTransfersList as TokenTransfersListComponent } from "./TokenTransfersList";

type Story = StoryObj<typeof TokenTransfersListComponent>;

const meta: Meta<typeof TokenTransfersListComponent> = {
    title: "Molecules/Token Transfers List",
    component: TokenTransfersListComponent,
};

export default meta;

export const TokenTransfersList: Story = {
    args: {
        chain_name: "eth-mainnet",
        address: "0x1dc3bcc07b93c73c476d7e1056b64c8bd947184a",
        contract_address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
};
