import { NFTApprovalList as NFTApprovalListComponent } from "./NFTApprovalList";
import { storyAction } from "@/utils/functions";
import { type Meta, type StoryObj } from "@storybook/react";

type Story = StoryObj<typeof NFTApprovalListComponent>;

const meta: Meta<typeof NFTApprovalListComponent> = {
    title: "Molecules/NFT/NFT Approval List",
    component: NFTApprovalListComponent,
};

export default meta;

export const NFTApprovalList: Story = {
    args: {
        chain_name: "eth-mainnet",
        address: "demo.eth",
        actionable_token: (approval) => storyAction(approval),
        actionable_spender: (approval) => storyAction(approval),
    },
};
