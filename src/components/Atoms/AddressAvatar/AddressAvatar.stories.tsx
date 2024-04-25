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
        size: GRK_SIZES.SMALL,
        type: "fingerprint",
        address: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
    },
    render: ({
        size,
        type,
        address,
        rounded,
        custom_avatar,
    }: AddressAvatarProps) => {
        return (
            <>
                <div className="m-1">
                    <AddressAvatarComponent
                        address={address}
                        size={size}
                        type={type}
                        rounded={rounded}
                        custom_avatar={custom_avatar}
                    />
                </div>

                <div className="m-1 mt-20 flex gap-1">
                    <AddressAvatarComponent
                        address={address}
                        size={GRK_SIZES.LARGE}
                        type={"effigy"}
                    />
                    <AddressAvatarComponent
                        address={address}
                        size={GRK_SIZES.MEDIUM}
                        type={"wallet"}
                    />
                    <AddressAvatarComponent
                        address={address}
                        size={GRK_SIZES.SMALL}
                        type={"effigy"}
                    />
                    <AddressAvatarComponent
                        address={address}
                        size={GRK_SIZES.EXTRA_SMALL}
                        type={"fingerprint"}
                    />
                    <AddressAvatarComponent
                        address={address}
                        size={GRK_SIZES.EXTRA_EXTRA_SMALL}
                        type={"wallet"}
                    />
                </div>
            </>
        );
    },
};
