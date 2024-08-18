import { BlocksList as BlocksListComponent } from "./BlocksList";
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
    },
};
