import { type Meta, type StoryObj } from "@storybook/react";
import { TokenTransfersListView } from "./TokenTransfersListView";

type Story = StoryObj<typeof TokenTransfersListView>;

const meta: Meta<typeof TokenTransfersListView> = {
    title: "Organisms/Token Transfers",
    component: TokenTransfersListView,
};

export default meta;

export const TokenTransfers: Story = {
    args: {
        chain_name: "eth-mainnet",
        address: "0x1dc3bcc07b93c73c476d7e1056b64c8bd947184a",
        contract_address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
};
