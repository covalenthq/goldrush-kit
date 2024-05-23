import { type Meta, type StoryObj } from "@storybook/react";
import { NFTApprovalList as NFTApprovalListComponent } from "./NFTApprovalList";
import { fn } from "@storybook/test";

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
        actionable_token: (approval) => ({
            parent: "button",
            parentProps: {
                onClick: fn(() => {
                    console.log(approval);
                }),
            },
        }),
        actionable_spender: (approval) => ({
            parent: "button",
            parentProps: {
                onClick: fn(() => {
                    console.log(approval);
                }),
            },
        }),
    },
};
