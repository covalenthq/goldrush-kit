import { useEffect, useState } from "react";
import { type MultiChainAssetCardViewProps } from "@/utils/types/molecules.types";
import { useCovalent } from "@/utils/store/Covalent";
import { Card, DonutChart, Title } from "@tremor/react";

export const MultiChainAssetCardView: React.FC<
    MultiChainAssetCardViewProps
> = ({ chains_name, address }) => {
    type ChainData = {
        chain: string;
        value: number;
        assets: { token: string; value: number }[];
    };

    const { covalentClient } = useCovalent();
    const [allChainData, setAllChainData] = useState<ChainData[]>([]);
    const [chainData, setChainData] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);

    const valueFormatter = (number: number) =>
        `$ ${new Intl.NumberFormat("us").format(number).toString()}`;

    const handleMultiChainAsset = async () => {
        setIsLoading(true);
        try {
            const requests = chains_name.map(async (chain_name) => {
                const response =
                    await covalentClient.BalanceService.getTokenBalancesForWalletAddress(
                        chain_name,
                        address,
                        { quoteCurrency: "USD" }
                    );

                const assets = response.data.items.map((item) => ({
                    token: item.contract_name,
                    value: parseFloat(item.pretty_quote.replace("$", "")),
                }));

                const sum = assets.reduce(
                    (total, asset) => total + asset.value,
                    0
                );

                return { chain: chain_name, value: sum, assets };
            });

            const results = await Promise.all(requests);

            setAllChainData(results);
            setIsLoading(false);
        } catch (error) {
            console.error(`Error fetching balance for ${address}`, error);
        }
    };

    useEffect(() => {
        handleMultiChainAsset();
    }, [chains_name, address]);

    return (
        <Card className="max-w-lg">
            <Title className="mb-4 text-xl font-semibold">
                Multi-Chain Asset Allocation
            </Title>
            <div className="space-y-6">
                <div className="rounded-lg border border-gray-200 p-6">
                    <Title>
                        Total Portfolio Value Distribution Across Chains
                    </Title>
                    <div className="mt-6">
                        {isLoading ? (
                            <div>Loading...</div>
                        ) : (
                            <div>
                                <p className="mb-5 text-center font-mono text-sm text-slate-500">
                                    {address}
                                </p>
                                <DonutChart
                                    className="w-full"
                                    data={allChainData}
                                    category="value"
                                    index="chain"
                                    valueFormatter={valueFormatter}
                                    onValueChange={(v) => setChainData(v)}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="rounded-lg border border-gray-200 p-6">
                    <Title>Portfolio Breakdown for Each Chain</Title>
                    <div className="mt-6">
                        {isLoading ? (
                            <div>Loading...</div>
                        ) : (
                            <div>
                                <p className="mb-5 text-center font-mono text-sm text-slate-500">
                                    {chainData && chainData.chain !== null
                                        ? chainData.chain
                                        : ""}
                                </p>
                                <DonutChart
                                    className="w-full"
                                    data={chainData ? chainData.assets : []}
                                    category="value"
                                    index="token"
                                    valueFormatter={valueFormatter}
                                    noDataText="Please select a chain on the pie chart above"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};
