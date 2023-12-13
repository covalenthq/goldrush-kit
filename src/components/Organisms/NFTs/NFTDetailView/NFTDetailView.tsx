import { TypographyH1, TypographyH4 } from "@/components/ui/typography";
import { useCovalent } from "@/utils/store/Covalent";
import { NFTSalesCountView } from "@/components/Molecules/NFTs/NFTSalesCountView/NFTSalesCountView";
import { NFTFloorPriceView } from "@/components/Molecules/NFTs/NFTFloorPriceView/NFTFloorPriceView";
import { type Option, Some, None } from "@/utils/option";
import { type NFTDetailViewProps } from "@/utils/types/organisms.types";
import { type NftTokenContract } from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";

export const NFTDetailView: React.FC<NFTDetailViewProps> = ({
    chain_name,
    collection_address,
    token_id,
}) => {
    const [maybeResult, setResult] = useState<Option<NftTokenContract>>(None);
    const { covalentClient } = useCovalent();

    useEffect(() => {
        (async () => {
            const response =
                await covalentClient.NftService.getNftMetadataForGivenTokenIdForContract(
                    chain_name,
                    collection_address,
                    token_id
                );

            setResult(new Some(response.data.items[0]));
        })();
    }, [chain_name, collection_address, token_id]);

    return maybeResult.match({
        None: () => <div>Loading...</div>,
        Some: (result) => {
            return (
                <div className="w-full">
                    <TypographyH1>
                        {result.contract_name} #
                        {result.nft_data.token_id?.toString()}{" "}
                    </TypographyH1>

                    <div className="mt-4 flex gap-4">
                        <div className="max-w-[30rem] rounded border ">
                            <img
                                className="rounded-t"
                                src={result.nft_data.external_data.image_512}
                            />

                            <div className="mt-2 p-4">
                                <TypographyH4>Attributes</TypographyH4>

                                <div className="mt-2 flex flex-wrap gap-4">
                                    {result.nft_data.external_data?.attributes.map(
                                        (attrs, i) => {
                                            return (
                                                <div
                                                    key={i}
                                                    className="rounded border bg-accent-foreground/30 p-2"
                                                >
                                                    <p className="text-muted-foreground">
                                                        {attrs.trait_type}
                                                    </p>
                                                    <p>{attrs.value}</p>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className=" flex w-full flex-col gap-4">
                            <div className="">
                                <NFTSalesCountView
                                    chain_name={chain_name}
                                    collection_address={collection_address}
                                    token_id={token_id}
                                />
                            </div>
                            <div className="">
                                <NFTFloorPriceView
                                    chain_name={chain_name}
                                    collection_address={collection_address}
                                    token_id={token_id}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            );
        },
    });
};
