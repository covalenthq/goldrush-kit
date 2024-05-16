import { type Meta, type StoryObj } from "@storybook/react";
import { TokenApprovals as TokenApprovalsComponent } from "./TokenApprovalList";

type Story = StoryObj<typeof TokenApprovalsComponent>;

const meta: Meta<typeof TokenApprovalsComponent> = {
    title: "Molecules/Address/Approval",
    component: TokenApprovalsComponent,
};

export default meta;

export const TokenApprovals: Story = {
    args: {
        chain_name: "eth-mainnet",
        address: "demo.eth",
    },
};
