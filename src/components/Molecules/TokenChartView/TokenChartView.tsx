import { Card, DonutChart, Title, BarList, Grid } from "@tremor/react";
import { type TokenChartViewProps } from "@/utils/types/molecules.types";
import { useCovalent } from "@/utils/store/Covalent";
import { useEffect, useState } from "react";
import { type BalanceItem } from "@covalenthq/client-sdk";

export const TokenChartView: React.FC<TokenChartViewProps> = ({
    chain_name,
    address,
}) => {
    const { covalentClient } = useCovalent();
    const [result, setResult] = useState<{ name: string; value: number }[]>([]);

    // Run on first render.
    useEffect(() => {
        (async () => {
            try {
                const response =
                    await covalentClient.BalanceService.getTokenBalancesForWalletAddress(
                        chain_name,
                        address,
                        { noNftFetch: false, noSpam: true }
                    );
                transformData(response.data.items);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    const transformData = (data: BalanceItem[]) => {
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

    const valueFormatter = (number: number) =>
        `$ ${new Intl.NumberFormat("us").format(number).toString()}`;

    return (
        <Card>
            <Title>Token Chart view</Title>
            <Grid
                numItems={1}
                numItemsSm={1}
                numItemsLg={2}
                className="items-center justify-center gap-2"
            >
                <DonutChart
                    className="mt-4"
                    data={result}
                    variant="donut"
                    category="value"
                    valueFormatter={valueFormatter}
                    index="name"
                    colors={[
                        "rose",
                        "yellow",
                        "orange",
                        "indigo",
                        "blue",
                        "emerald",
                    ]}
                />
                <BarList
                    data={result}
                    className="mt-2"
                    valueFormatter={valueFormatter}
                />
            </Grid>
        </Card>
    );
};

export default TokenChartView;