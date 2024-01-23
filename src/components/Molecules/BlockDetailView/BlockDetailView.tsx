import {
    Card,
    Metric,
    Text,
    Flex,
    Divider,
    Bold,
    Grid,
    Title,
} from "@tremor/react";
import { Address } from "@/components/Atoms/Address/Address";
import { useCovalent } from "@/utils/store/Covalent";
import { useEffect, useState } from "react";
import { type Option, Some, None } from "@/utils/option";
import { Skeleton } from "@/components/ui/skeleton";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { type BlockDetailViewProps } from "@/utils/types/molecules.types";

interface ResultBlock {
    block: number;
    timestamp: string;
    miner: string;
    transactions: number;
}

export const BlockDetailView: React.FC<BlockDetailViewProps> = ({
    chain_name = "eth-mainnet",
    block_height = "latest",
}) => {
    const [result, setResult] = useState<Option<ResultBlock>>(None);
    const { covalentClient } = useCovalent();

    useEffect(() => {
        (async () => {
            try {
                const responseBlock = await covalentClient.BaseService.getBlock(
                    chain_name,
                    block_height
                );
                const responseDetailBlock =
                    await covalentClient.TransactionService.getTransactionsForBlock(
                        chain_name,
                        responseBlock.data.items[0].height
                    );
                setResult(
                    new Some({
                        block: responseBlock.data.items[0].height,
                        miner: responseDetailBlock.data.items[0].miner_address,
                        timestamp: transformDate(
                            responseBlock.data.items[0].signed_at
                        ),
                        transactions: responseDetailBlock.data.items.length,
                    })
                );
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    const transformDate = (dateObj: Date): string => {
        const weekday = dateObj.toLocaleDateString("en-US", {
            weekday: "short",
        });
        const day = dateObj.getDate();
        const month = dateObj.toLocaleDateString("en-US", { month: "short" });
        const year = dateObj.getFullYear();
        const hours = dateObj.getHours();
        const minutes = dateObj.getMinutes();
        const formattedDate = `${weekday}, ${day} ${month} ${year} ${hours}:${
            minutes < 10 ? `0${minutes}` : minutes
        }:00`;
        return formattedDate;
    };
    return (
        <Card className="w-[22rem] max-w-full">
            <Title>Block Height</Title>
            {result.match({
                None: () => <Skeleton size={GRK_SIZES.LARGE} />,
                Some: (data: ResultBlock) => <Metric>{data.block}</Metric>,
            })}
            <Divider></Divider>
            <Grid className="gap-2">
                <Flex alignItems="center" justifyContent="between">
                    <Text>
                        <Bold>Timestamp</Bold>
                    </Text>
                    {result.match({
                        None: () => <Skeleton size={GRK_SIZES.SMALL} />,
                        Some: (data: ResultBlock) => (
                            <Text>{data.timestamp}</Text>
                        ),
                    })}
                </Flex>
                <Flex alignItems="center" justifyContent="between">
                    <Text>
                        <Bold>Miner</Bold>
                    </Text>
                    {result.match({
                        None: () => <Skeleton size={GRK_SIZES.SMALL} />,
                        Some: (data: ResultBlock) => (
                            <Address address={data.miner} />
                        ),
                    })}
                </Flex>
                <Flex alignItems="center" justifyContent="between">
                    <Text>
                        <Bold>Total Transactions</Bold>
                    </Text>
                    {result.match({
                        None: () => <Skeleton size={GRK_SIZES.SMALL} />,
                        Some: (data: ResultBlock) => (
                            <Text>{data.transactions} Transactions</Text>
                        ),
                    })}
                </Flex>
            </Grid>
        </Card>
    );
};
