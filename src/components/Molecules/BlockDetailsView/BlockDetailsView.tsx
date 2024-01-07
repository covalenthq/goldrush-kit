import { copyToClipboard, truncate } from "@/utils/functions";
import { useEffect, useState } from "react";
import { type BlockDetailsViewProps } from "@/utils/types/molecules.types";
import { useCovalent } from "@/utils/store/Covalent";
import { type Transaction } from "@covalenthq/client-sdk";
import { type Option, Some, None } from "@/utils/option";

export const BlockDetailsView: React.FC<BlockDetailsViewProps> = ({
    chain_name,
    block_id,
}) => {
    const [maybeResult, setResult] = useState<Option<Transaction[]>>(None);
    const { covalentClient } = useCovalent();

    const fetchBlockData = async () => {
        setResult(None);
        let response;
        try {
            response =
                await covalentClient.TransactionService.getTransactionsForBlock(
                    chain_name,
                    block_id,
                    { quoteCurrency: "USD", noLogs: true, withSafe: false }
                );
            console.log(response.data)
            setResult(new Some(response.data.items));
        } catch (error) {
            console.error(
                `Error fetching block data for ${chain_name}:`,
                error
            );
        }
    };

    useEffect(() => {
        fetchBlockData();
    }, [chain_name, block_id]);

    return (
        <>
            <div className="flex w-full items-center gap-x-4 rounded border p-2 md:max-w-[18rem] lg:max-w-[18rem]">
                <div>{chain_name}</div>
                <div>{block_id.toString()}</div>
                <div>
                    {maybeResult.match({
                        None: () => {
                            return <>Nothing</>;
                        },
                        Some: (data) => {
                            if (data[0])
                            {
                                return <>
                                <div>Block Hash: {data[0].block_hash}</div>
                                <div>Block Timestamp: {data[0].block_signed_at.toDateString()}</div>
                                <div>Miner Address: {data[0].miner_address}</div>
                                <div>Number of Txs: {data.length}</div>
                                </>;
                            }
                            else 
                            {
                                return <>No Data</>
                            }
                            
                        },
                    })}
                </div>
            </div>
        </>
    );
};
