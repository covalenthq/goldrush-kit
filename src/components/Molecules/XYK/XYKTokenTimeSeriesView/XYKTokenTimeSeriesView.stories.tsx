import { type Meta, type StoryObj } from "@storybook/react";
import { XYKTokenTimeSeriesView } from "./XYKTokenTimeSeriesView";

type Story = StoryObj<typeof XYKTokenTimeSeriesView>;

const meta: Meta<typeof XYKTokenTimeSeriesView> = {
    title: "Molecules/XYK",
    component: XYKTokenTimeSeriesView,
};

export default meta;

export const XYKTokenTimeSeries: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
        token_address: "0x02af166a28393809f55bb5befbcc27ec15908241",
        token_data: {
            chain_name: "eth-mainnet",
            chain_id: "1",
            dex_name: "uniswap_v2",
            contract_address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
            contract_name: "Wrapped Ether",
            total_liquidity: "488203002921935128301596",
            total_volume_24h: "124541160873367206618441",
            logo_url:
                "https://logos.covalenthq.com/tokens/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
            contract_ticker_symbol: "WETH",
            contract_decimals: 18,
            swap_count_24h: 14,
            quote_rate: 2550.9326,
            total_liquidity_quote: 1.2453729e9,
            total_volume_24h_quote: 3.176961e8,
            transactions_24h: 146210,
            quote_rate_24h: 2594.5093,
            pretty_quote_rate: "$2,550.93",
            pretty_quote_rate_24h: "$2,594.51",
            pretty_total_liquidity_quote: "$1,245,372,928.00",
            pretty_total_volume_24h_quote: "$317,696,096.00",
            volume_timeseries_7d: [
                {
                    dex_name: "uniswap_v2",
                    chain_id: "1",
                    dt: "2024-01-11T00:00:00Z",
                    volume_quote: 4.1855388e7,
                    pretty_volume_quote: "$41,855,388.00",
                },
            ],
            volume_timeseries_30d: [
                {
                    dex_name: "uniswap_v2",
                    chain_id: "1",
                    dt: "2024-01-11T00:00:00Z",
                    volume_quote: 4.1855388e7,
                    pretty_volume_quote: "$41,855,388.00",
                },
            ],
            liquidity_timeseries_7d: [
                {
                    dex_name: "uniswap_v2",
                    chain_id: "1",
                    dt: "2024-01-11T00:00:00Z",
                    liquidity_quote: 5729.7476,
                    pretty_liquidity_quote: "$5,729.75",
                },
            ],
            liquidity_timeseries_30d: [
                {
                    dex_name: "uniswap_v2",
                    chain_id: "1",
                    dt: "2024-01-11T00:00:00Z",
                    liquidity_quote: 5729.7476,
                    pretty_liquidity_quote: "$5,729.75",
                },
            ],
            price_timeseries_7d: [
                {
                    dex_name: "uniswap_v2",
                    chain_id: "1",
                    dt: "2024-01-11T00:00:00Z",
                    quote_currency: "USD",
                    quote_rate: 2617.2017,
                    pretty_quote_rate: "$2,617.20",
                },
            ],
            price_timeseries_30d: [
                {
                    dex_name: "uniswap_v2",
                    chain_id: "1",
                    dt: "2024-01-11T00:00:00Z",
                    quote_currency: "USD",
                    quote_rate: 2617.2017,
                    pretty_quote_rate: "$2,617.20",
                },
            ],
        },
    },
};
