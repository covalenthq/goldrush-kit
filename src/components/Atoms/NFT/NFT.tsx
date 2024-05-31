import { type NFTProps } from "@/utils/types/atoms.types";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { GRK_SIZES, defaultErrorNFT } from "@/utils/constants/shared.constants";
import { CardDetail } from "@/components/Shared";
import { TokenAvatar } from "../TokenAvatar/TokenAvatar";
import { useGoldRush } from "@/utils/store";
import { type ChainItem } from "@covalenthq/client-sdk";
import { useMemo } from "react";

export const NFT: React.FC<NFTProps> = ({
    collection_name,
    token_id,
    attributes = [],
    src,
    children = null,
    chain_name = null,
}) => {
    const { chains } = useGoldRush();

    const chain = useMemo<ChainItem | null>(
        () => chains?.find((o) => o.name === chain_name) ?? null,
        [chains, chain_name]
    );

    return (
        <Card className="w-64 overflow-hidden break-all bg-background-light p-0 dark:bg-background-dark">
            <CardContent className="relative rounded transition-all">
                <img
                    className="block h-64 w-64 object-cover"
                    src={src || defaultErrorNFT}
                    onError={(e) => {
                        e.currentTarget.src = defaultErrorNFT;
                    }}
                />

                {chain ? (
                    <div
                        className="absolute -bottom-4 right-2 flex h-9 w-9 items-center justify-center rounded-[100%] bg-background-light p-1 dark:bg-background-dark"
                        style={{
                            border: `2px solid `,
                            borderColor: `${chain.color_theme.hex}`,
                        }}
                    >
                        <TokenAvatar
                            is_chain_logo
                            size={GRK_SIZES.EXTRA_SMALL}
                            chain_color={chain.color_theme.hex}
                            token_url={chain?.logo_url}
                        />
                    </div>
                ) : (
                    <></>
                )}
            </CardContent>

            <CardDetail
                heading={collection_name?.toUpperCase() ?? null}
                content={token_id ? `#${token_id}` : null}
                wrapperClassName="p-2"
            />

            {children}

            {attributes?.length ? (
                <ul className="p-2 text-sm">
                    <CardDescription className="mb-1">
                        ATTRIBUTES
                    </CardDescription>

                    {attributes.map(({ trait_type, value }) => (
                        <li key={trait_type} className="flex justify-between">
                            <CardDescription>{trait_type}</CardDescription>

                            {value}
                        </li>
                    ))}
                </ul>
            ) : (
                <></>
            )}
        </Card>
    );
};
