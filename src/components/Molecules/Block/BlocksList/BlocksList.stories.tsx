import { BlocksList as BlocksListComponent } from "./BlocksList";
import { storyAction } from "@/utils/functions";
import { type Meta, type StoryObj } from "@storybook/react";

type Story = StoryObj<typeof BlocksListComponent>;

const meta: Meta<typeof BlocksListComponent> = {
    title: "Molecules/Block/Blocks List",
    component: BlocksListComponent,
};

export default meta;

export const BlocksList: Story = {
    args: {
        chain_name: "eth-mainnet",
        actionable_block: (block_height) => storyAction(block_height),
        page_number: 0,
        page_size: 10,
        on_page_change: (updatedPagination) => {
            console.log(updatedPagination);
        },
    },
};
