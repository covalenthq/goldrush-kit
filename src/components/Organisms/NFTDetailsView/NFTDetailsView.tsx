import { useGoldRush } from "@/utils/store";
import { NFTFloorPrice, NFTSalesCount } from "@/components/Molecules";
import { type Option, Some, None } from "@/utils/option";
import { type NFTDetailsViewProps } from "@/utils/types/organisms.types";
import { type NftTokenContract } from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";
import {
    ALLOWED_CACHE_CHAINS,
    DEFAULT_ERROR_MESSAGE,
} from "@/utils/constants/shared.constants";
import { type CovalentAPIError } from "@/utils/types/shared.types";
import { NFT } from "@/components/Atoms";
import { SkeletonNFT } from "@/components/Shared";

export const NFTDetailsView: React.FC<NFTDetailsViewProps> = ({
    chain_name,
    collection_address,
    token_id,
}) => {
    const { covalentClient } = useGoldRush();
    const [maybeResult, setMaybeResult] =
        useState<Option<NftTokenContract | null>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const { data, ...error } =
                    await covalentClient.NftService.getNftMetadataForGivenTokenIdForContract(
                        chain_name,
                        collection_address,
                        token_id,
                        {
                            withUncached:
                                !ALLOWED_CACHE_CHAINS.includes(chain_name),
                        }
                    );
                if (error.error) {
                    throw error;
                }
                setMaybeResult(new Some(data.items[0]));
            } catch (error: CovalentAPIError | any) {
                setErrorMessage(error?.error_message ?? DEFAULT_ERROR_MESSAGE);
                setMaybeResult(new Some(null));
                console.error(error);
            }
        })();
    }, [chain_name, collection_address, token_id]);

    return (
        <div className="flex w-full gap-4">
            <div>
                {maybeResult.match({
                    None: () => <SkeletonNFT />,
                    Some: (nft) =>
                        errorMessage ? (
                            <p>{errorMessage}</p>
                        ) : nft ? (
                            <NFT
                                src={
                                    nft.nft_data.external_data?.image_256 ||
                                    nft.nft_data.external_data?.image_512 ||
                                    nft.nft_data.external_data?.image_1024
                                }
                                attributes={
                                    nft.nft_data.external_data?.attributes
                                }
                                collection_name={nft.contract_name}
                                token_id={nft.nft_data.token_id}
                            />
                        ) : (
                            <></>
                        ),
                })}
            </div>

            <div className="flex w-full flex-col gap-4">
                <NFTSalesCount
                    chain_name={chain_name}
                    collection_address={collection_address}
                    token_id={token_id}
                />

                <NFTFloorPrice
                    chain_name={chain_name}
                    collection_address={collection_address}
                    token_id={token_id}
                />
            </div>
        </div>
    );
};
