import { type NFTProps } from "@/utils/types/atoms.types";
import { Card } from "@tremor/react";
import { CardContent, CardDescription } from "@/components/ui/card";
import { defaultErrorNFT } from "@/utils/constants/shared.constants";
import { CardDetail } from "@/components/Shared";

export const NFT: React.FC<NFTProps> = ({
    collection_name,
    token_id,
    attributes = [],
    src,
}) => {
    return (
        <Card className="w-64 overflow-hidden p-0">
            <CardContent className="rounded transition-all">
                <img
                    className="block h-64 w-64 object-cover"
                    src={src || defaultErrorNFT}
                    onError={(e) => {
                        e.currentTarget.src = defaultErrorNFT;
                    }}
                />
            </CardContent>

            <CardDetail
                heading={collection_name?.toUpperCase() ?? null}
                content={token_id ? `#${token_id}` : null}
                wrapperClassName="p-2"
            />

            {attributes.length ? (
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
