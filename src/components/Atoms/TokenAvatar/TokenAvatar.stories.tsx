import { TokenAvatar as TokenAvatarComponent } from "./TokenAvatar";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { type Meta, type StoryObj } from "@storybook/react";

const meta: Meta<typeof TokenAvatarComponent> = {
    title: "Atoms/Token Avatar",
    component: TokenAvatarComponent,
};

export default meta;

type Story = StoryObj<typeof TokenAvatarComponent>;

export const TokenAvatar: Story = {
    args: {
        size: GRK_SIZES.LARGE,
        primary_url:
            "https://logos.covalenthq.com/tokens/1/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
        rounded: true,
        only_primary: false,
        chain_color: "#5E798A",
        secondary_url:
            "https://www.datocms-assets.com/86369/1699425239-uniswap.jpg",
    },
};
