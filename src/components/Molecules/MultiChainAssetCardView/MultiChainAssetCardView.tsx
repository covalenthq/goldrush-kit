import { Card, DonutChart, Title, BarList, Grid } from "@tremor/react";
import { type MultiChainAssetViewProps } from "@/utils/types/molecules.types";
import { useCovalent } from "@/utils/store/Covalent";
import { useEffect, useState } from "react";
import { type BalanceItem } from "@covalenthq/client-sdk";

export const MultiChainAssetCardView: React.FC<MultiChainAssetViewProps> = ({
    chain_names,
    wallet_address,
    variant = "donut",
    has_legend = true,
}) => {
    const [result, setResult] = useState<{ name: string; value: number }[]>([]);
    const { covalentClient } = useCovalent();

    const addData = (data: BalanceItem[]) => {
        if (data.length <= 5) {
            setResult(
                data.map((item) => {
                    return {
                        name: item.contract_display_name,
                        value: item.quote,
                    };
                })
            );
        }
        const remainingValue = data
            .slice(5)
            .reduce((acc, cur) => acc + cur.quote, 0);
        setResult([
            ...data.slice(0, 5).map((item) => {
                return { name: item.contract_display_name, value: item.quote };
            }),
            { name: "Others", value: remainingValue },
        ]);
    };

    useEffect(() => {
        try {
            var promArray = [];
            for (let index = 0; index < chain_names.length; index++) {
                const chain = chain_names[index];
                const prom =
                    covalentClient.BalanceService.getTokenBalancesForWalletAddress(
                        chain,
                        wallet_address,
                        { noNftFetch: false, noSpam: true }
                    );
                promArray.push(prom);
                Promise.all(promArray).then((resp) => {
                    var resultStore = new Array();
                    resp.forEach((item) => {
                        resultStore = resultStore.concat(item.data.items);
                    });

                    addData(
                        resultStore.sort((a, b) => {
                            return b.quote - a.quote;
                        })
                    );
                    console.log(resultStore);
                });
            }
        } catch (error) {
            console.log(error);
        }
    }, [wallet_address, chain_names]);

    const valueFormatter = (number: number) =>
        `$${new Intl.NumberFormat("us").format(Math.round(number)).toString()}`;

    return (
        <Card>
            <Title>Multi-Chain Assets</Title>
            <Grid
                numItems={1}
                numItemsSm={1}
                numItemsLg={has_legend ? 2 : 1}
                className="items-center justify-center gap-2"
            >
                <DonutChart
                    className="mt-6"
                    data={result}
                    variant={variant}
                    category="value"
                    index="name"
                    valueFormatter={valueFormatter}
                    colors={[
                        "slate",
                        "violet",
                        "indigo",
                        "rose",
                        "cyan",
                        "amber",
                    ]}
                />
                {has_legend && (
                    <BarList
                        data={result}
                        className="mt-2"
                        valueFormatter={valueFormatter}
                    />
                )}
            </Grid>
        </Card>
    );
};
