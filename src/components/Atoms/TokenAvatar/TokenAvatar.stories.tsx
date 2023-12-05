import { type Meta, type StoryObj } from "@storybook/react";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { TokenAvatarView } from "./TokenAvatarView";

const meta: Meta<typeof TokenAvatarView> = {
    title: "Atoms/TokenAvatar",
    component: TokenAvatarView,
};

export default meta;

type Story = StoryObj<typeof TokenAvatarView>;

export const TokenAvatar: Story = {
    args: {
        size: GRK_SIZES.SMALL,
    },
    render: () => {
        return (
            <>
                <div className="m-1">
                    <TokenAvatarView
                        token_url="https://logos.covalenthq.com/tokens/1/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                        size={GRK_SIZES.MEDIUM}
                    />
                </div>
                <div className="m-1 mt-20 flex gap-1">
                    <TokenAvatarView
                        token_url="https://logos.covalenthq.com/tokens/1/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                        size={GRK_SIZES.EXTRA_EXTRA_SMALL}
                    />

                    <TokenAvatarView
                        token_url="https://logos.covalenthq.com/tokens/1/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                        size={GRK_SIZES.EXTRA_SMALL}
                    />
                    <TokenAvatarView
                        token_url="https://logos.covalenthq.com/tokens/1/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                        size={GRK_SIZES.SMALL}
                    />
                    <TokenAvatarView
                        token_url="https://logos.covalenthq.com/tokens/1/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                        size={GRK_SIZES.MEDIUM}
                    />
                    <TokenAvatarView
                        token_url="https://logos.covalenthq.com/tokens/1/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                        size={GRK_SIZES.LARGE}
                    />
                </div>
                <div className="m-1 mt-20 flex gap-3">
                    <TokenAvatarView
                        token_url="https://logos.covalenthq.com/tokens/1/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                        size={GRK_SIZES.EXTRA_SMALL}
                        chain_color={"grey"}
                        sub_url={
                            "https://www.datocms-assets.com/86369/1699425239-uniswap.jpg"
                        }
                    />
                    <TokenAvatarView
                        token_url="https://logos.covalenthq.com/tokens/1/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                        size={GRK_SIZES.SMALL}
                        chain_color={"grey"}
                        sub_url={
                            "https://www.datocms-assets.com/86369/1699425239-uniswap.jpg"
                        }
                    />
                    <TokenAvatarView
                        token_url="https://logos.covalenthq.com/tokens/1/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                        size={GRK_SIZES.MEDIUM}
                        chain_color={"grey"}
                        sub_url={
                            "https://www.datocms-assets.com/86369/1699425239-uniswap.jpg"
                        }
                    />
                    <TokenAvatarView
                        token_url="https://logos.covalenthq.com/tokens/1/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                        size={GRK_SIZES.LARGE}
                        chain_color={"grey"}
                        sub_url={
                            "https://www.datocms-assets.com/86369/1699425239-uniswap.jpg"
                        }
                    />
                </div>
            </>
        );
    },
};
