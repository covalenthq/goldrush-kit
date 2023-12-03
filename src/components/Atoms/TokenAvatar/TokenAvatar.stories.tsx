import { type Meta, type StoryObj } from "@storybook/react";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { TokenAvatar } from "./TokenAvatar";

const meta: Meta<typeof TokenAvatar> = {
    title: "Atoms/TokenAvatar",
    component: TokenAvatar,
};

export default meta;

type Story = StoryObj<typeof TokenAvatar>;

export const TokenAvatarDisplay: Story = {
    args: {
        size: GRK_SIZES.SMALL,
    },
    render: () => {
        return (
            <>
                <div className="m-1">
                    <TokenAvatar
                        token_url="https://logos.covalenthq.com/tokens/1/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                        size={GRK_SIZES.MEDIUM}
                    />
                </div>
                <div className="m-1 mt-20 flex gap-1">
                    <TokenAvatar
                        token_url="https://logos.covalenthq.com/tokens/1/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                        size={GRK_SIZES.EXTRA_EXTRA_SMALL}
                    />

                    <TokenAvatar
                        token_url="https://logos.covalenthq.com/tokens/1/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                        size={GRK_SIZES.EXTRA_SMALL}
                    />
                    <TokenAvatar
                        token_url="https://logos.covalenthq.com/tokens/1/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                        size={GRK_SIZES.SMALL}
                    />
                    <TokenAvatar
                        token_url="https://logos.covalenthq.com/tokens/1/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                        size={GRK_SIZES.MEDIUM}
                    />
                    <TokenAvatar
                        token_url="https://logos.covalenthq.com/tokens/1/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                        size={GRK_SIZES.LARGE}
                    />
                </div>
                <div className="m-1 mt-20 flex gap-3">
                    <TokenAvatar
                        token_url="https://logos.covalenthq.com/tokens/1/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                        size={GRK_SIZES.EXTRA_SMALL}
                        chain_color={"grey"}
                        sub_url={
                            "https://www.datocms-assets.com/86369/1699425239-uniswap.jpg"
                        }
                    />
                    <TokenAvatar
                        token_url="https://logos.covalenthq.com/tokens/1/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                        size={GRK_SIZES.SMALL}
                        chain_color={"grey"}
                        sub_url={
                            "https://www.datocms-assets.com/86369/1699425239-uniswap.jpg"
                        }
                    />
                    <TokenAvatar
                        token_url="https://logos.covalenthq.com/tokens/1/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                        size={GRK_SIZES.MEDIUM}
                        chain_color={"grey"}
                        sub_url={
                            "https://www.datocms-assets.com/86369/1699425239-uniswap.jpg"
                        }
                    />
                    <TokenAvatar
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
