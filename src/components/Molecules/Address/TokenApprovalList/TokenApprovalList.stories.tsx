import { type Meta, type StoryObj } from "@storybook/react";
import { TokenApprovalList as TokenApprovalListComponent } from "./TokenApprovalList";

type Story = StoryObj<typeof TokenApprovalListComponent>;

const meta: Meta<typeof TokenApprovalListComponent> = {
    title: "Molecules/Address/Approval/Token Approval List",
    component: TokenApprovalListComponent,
};

export default meta;

export const TokenApprovalList: Story = {
    args: {
        chain_name: "eth-mainnet",
        address: "demo.eth",
    },
};
