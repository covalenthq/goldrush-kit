import { copyToClipboard, truncate } from "@/utils/functions";
import { Card, DonutChart, Title } from "@tremor/react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import QRCode from "react-qr-code";
import { useEffect, useState } from "react";
import { useToast } from "../../../utils/hooks/use-toast";
import { AddressAvatar } from "../../Atoms/AddressAvatar/AddressAvatar";
import { IconWrapper } from "../../Atoms/IconWrapper/IconWrapper";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { type TokenChartViewProps } from "@/utils/types/molecules.types";
import { useCovalent } from "@/utils/store/Covalent";
import { type Chain, type NftTokenContract } from "@covalenthq/client-sdk";
import { type Option, Some, None } from "@/utils/option";
import { Skeleton } from "@/components/ui/skeleton";
import { type CrossChainBalanceItem } from "@/utils/types/organisms.types";
import { rest } from "lodash";

export const TokenChartView: React.FC<TokenChartViewProps> = ({ address }) => {
    const hide_small_balances = false;
    const [maybeResult, setResult] =
        useState<Option<CrossChainBalanceItem[]>>(None);
        const [filterResult, setFilterResult] =
        useState<Option<CrossChainBalanceItem[]>>(None);
    const [error, setError] = useState({ error: false, error_message: "" });
    const { covalentClient, chains } = useCovalent();
    const [chartDataa, setChartDataa] = useState<any[]>([])


    const chain_names: Chain[] = [
        "eth-mainnet",
        "matic-mainnet",
        "bsc-mainnet",
        "avalanche-mainnet",
        "optimism-mainnet",
    ];


    function getChainData(){
        let data = filterResult.value?.map(res => res);
        let chartData = []
        // let ethData = 

        // console.log(filterResult.value[1].chain)
        let eth = data?.filter(c => c.chain === 'eth-mainnet').reduce((acc,curr)=>acc+parseInt(curr.balance),0)
        // console.log(data?.at(1));
        chartData.push({name: 'eth-mainnet', balance: eth})

        let matic = data?.filter(c => c.chain === 'matic-mainnet').reduce((acc,curr)=>acc+parseInt(curr.balance),0)
        // console.log(data?.at(1));
        chartData.push({name: 'matic-mainnet', balance: matic})

        let bsc = data?.filter(c => c.chain === 'bsc-mainnet').reduce((acc,curr)=>acc+parseInt(curr.balance),0)
        // console.log(data?.at(1));
        chartData.push({name: 'bsc-mainnet', balance: bsc})

        let avalance = data?.filter(c => c.chain === 'bsc-mainnet').reduce((acc,curr)=>acc+parseInt(curr.balance),0)
        // console.log(data?.at(1));
        chartData.push({name: 'avalanche-mainnet', balance: avalance})

        let opt = data?.filter(c => c.chain === 'optimism-mainnet').reduce((acc,curr)=>acc+parseInt(curr.balance),0)
        console.log(data?.filter(c => c.chain === 'eth-mainnet'));
        chartData.push({name: 'optimism-mainnet', balance: opt})


        setChartDataa(chartData)

        console.log(chartData)

    }

    const handleTokenBalances = async (_address: string) => {
        setResult(None);
        const promises = chain_names.map(async (chain) => {
            let response;
            try {
                response =
                    await covalentClient.BalanceService.getTokenBalancesForWalletAddress(
                        chain,
                        _address.trim()
                    );

                setError({ error: false, error_message: "" });
                return response.data.items.map((o) => {
                    return { ...o, chain };
                });
            } catch (error) {
                console.error(`Error fetching balances for ${chain}:`, error);
                setError({
                    error: response ? response.error : false,
                    error_message: response ? response.error_message : "",
                });
                return [];
            }
        });

        const results = await Promise.all(promises);
        setResult(new Some(results.flat()));
    };

    useEffect(() => {
        handleTokenBalances(address);
        // console.log(filterResult.value)
        // console.log(filterResult.value);
        getChainData()
    }, [chain_names, address]);

    useEffect(() => {
        maybeResult.match({
            None: () => [],
            Some: (result) => {
                if (hide_small_balances) {
                    setFilterResult(
                        new Some(
                            result.filter(
                                (o) =>
                                    o.quote !== null &&
                                    o.quote > 0 &&
                                    o.type !== "dust"
                            )
                        )
                    );
                    return result;
                }
                setFilterResult(new Some(result));
            },
        });
        // console.log(filterResult.value.filter(res => res.chain === 'eth_mainnet'))
    }, [maybeResult, hide_small_balances]);

    const valueFormatter = (number) => `$ ${new Intl.NumberFormat("us").format(number).toString()}`;

    return  <Card className="max-w-lg">
    <Title>Assets Chart</Title>
    <DonutChart
      className="mt-6"
      data={chartDataa}
      category="balance"
      index="name"
      valueFormatter={valueFormatter}
      colors={["slate", "violet", "indigo", "rose", "cyan"]}
    />
  </Card>;
};

export default TokenChartView;
