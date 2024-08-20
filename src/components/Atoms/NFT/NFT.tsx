import { TokenAvatar } from "../TokenAvatar/TokenAvatar";
import { CardDetail } from "@/components/Shared";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import {
    GRK_SIZES,
    DEFAULT_ERROR_NFT,
} from "@/utils/constants/shared.constants";
import { actionableWrapper } from "@/utils/functions";
import { useGoldRush } from "@/utils/store";
import { type NFTProps } from "@/utils/types/atoms.types";
import { type ChainItem } from "@covalenthq/client-sdk";
import { useMemo } from "react";

export const NFT: React.FC<NFTProps> = ({
    collection_name,
    collection_address,
    token_id,
    attributes = [],
    src,
    children = null,
    chain_name = null,
    actionable_contract = () => null,
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
                    src={src || DEFAULT_ERROR_NFT}
                    onError={(e) => {
                        e.currentTarget.src = DEFAULT_ERROR_NFT;
                    }}
                />

                {chain ? (
                    <div className="absolute bottom-1 right-1 flex">
                        <TokenAvatar
                            only_primary
                            size={GRK_SIZES.EXTRA_SMALL}
                            chain_color={chain.color_theme.hex}
                            primary_url={chain?.logo_url}
                        />
                    </div>
                ) : (
                    <></>
                )}
            </CardContent>

            <CardDetail
                heading={actionableWrapper(
                    actionable_contract(collection_address || ""),
                    collection_name?.toUpperCase() ?? null
                )}
                content={token_id ? `#${token_id}` : null}
                wrapperClassName="p-2 !text-left"
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
