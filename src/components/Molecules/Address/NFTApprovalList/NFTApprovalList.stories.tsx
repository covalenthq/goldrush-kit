import { type Meta, type StoryObj } from "@storybook/react";
import { NFTApprovals as NFTApprovalsComponent } from "./NFTApprovalList";

type Story = StoryObj<typeof NFTApprovalsComponent>;

const meta: Meta<typeof NFTApprovalsComponent> = {
    title: "Molecules/Address/Approval",
    component: NFTApprovalsComponent,
};

export default meta;

export const NFTApprovals: Story = {
    args: {
        chain_name: "eth-mainnet",
        address: "demo.eth",
    },
};
