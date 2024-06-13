import { type Meta, type StoryObj } from "@storybook/react";
import { AddressAvatar as AddressAvatarComponent } from "./AddressAvatar";
import { type AddressAvatarProps } from "@/utils/types/atoms.types";
import { GRK_SIZES } from "@/utils/constants/shared.constants";

const meta: Meta<typeof AddressAvatarComponent> = {
    title: "Atoms/Address Avatar",
    component: AddressAvatarComponent,
};

export default meta;

type Story = StoryObj<typeof AddressAvatarComponent>;

export const AddressAvatar: Story = {
    args: {
        size: GRK_SIZES.LARGE,
        type: "fingerprint",
        address: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        rounded: false,
    },
};
