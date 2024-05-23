import { type Meta, type StoryObj } from "@storybook/react";
import { TokenApprovalList as TokenApprovalListComponent } from "./TokenApprovalList";
import { storyAction } from "@/utils/functions";

type Story = StoryObj<typeof TokenApprovalListComponent>;

const meta: Meta<typeof TokenApprovalListComponent> = {
    title: "Molecules/Token/Token Approval List",
    component: TokenApprovalListComponent,
};

export default meta;

export const TokenApprovalList: Story = {
    args: {
        chain_name: "eth-mainnet",
        address: "demo.eth",
        actionable_token: (approval) => storyAction(approval),
        actionable_spender: (approval) => storyAction(approval),
    },
};
