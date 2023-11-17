import { type Meta, type StoryObj } from "@storybook/react";
import { AddressAvatar } from "./AddressAvatar";
import { type AddressAvatarProps } from "@/utils/types/atoms.types";
import { GRK_SIZES } from "@/utils/constants/shared.constants";

const meta: Meta<typeof AddressAvatar> = {
    title: "Atoms/AddressAvatar",
    component: AddressAvatar,
};

export default meta;

type Story = StoryObj<typeof AddressAvatar>;

const render = ({ size, type, address, rounded }: AddressAvatarProps) => {
    return (
        <>
            <div className="m-1">
                <AddressAvatar
                    address={address}
                    size={size}
                    type={type}
                    rounded={rounded}
                />
            </div>

            <div className="m-1 mt-20 flex gap-1">
                <AddressAvatar
                    address={address}
                    size={GRK_SIZES.LARGE}
                    type={"effigy"}
                />
                <AddressAvatar
                    address={address}
                    size={GRK_SIZES.MEDIUM}
                    type={"wallet"}
                />
                <AddressAvatar
                    address={address}
                    size={GRK_SIZES.SMALL}
                    type={"effigy"}
                />
                <AddressAvatar
                    address={address}
                    size={GRK_SIZES.EXTRA_SMALL}
                    type={"fingerprint"}
                />
                <AddressAvatar
                    address={address}
                    size={GRK_SIZES.EXTRA_EXTRA_SMALL}
                    type={"wallet"}
                />
            </div>
        </>
    );
};

export const AvatarSizes: Story = {
    args: {
        size: GRK_SIZES.SMALL,
        type: "fingerprint",
        address: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
    },
    render: render,
};
