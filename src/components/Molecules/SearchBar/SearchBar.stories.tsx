import { SearchBar as SearchBarComponent } from "./SearchBar";
import { type Meta, type StoryObj } from "@storybook/react";

type Story = StoryObj<typeof SearchBarComponent>;

const meta: Meta<typeof SearchBarComponent> = {
    title: "Molecules/Search Bar",
    component: SearchBarComponent,
};

export default meta;

export const SearchBar: Story = {};
