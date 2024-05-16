import { type Meta, type StoryObj } from "@storybook/react";
import { NFTApprovalList as NFTApprovalListComponent } from "./NFTApprovalList";

type Story = StoryObj<typeof NFTApprovalListComponent>;

const meta: Meta<typeof NFTApprovalListComponent> = {
    title: "Molecules/Address/Approval/NFT Approval List",
    component: NFTApprovalListComponent,
};

export default meta;

export const NFTApprovalList: Story = {
    args: {
        chain_name: "eth-mainnet",
        address: "demo.eth",
    },
};
