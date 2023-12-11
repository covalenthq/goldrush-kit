import { type Meta, type StoryObj } from "@storybook/react";
import { TokenBalancesListView } from "./TokenBalancesListView";
import { useEffect, useState } from "react";
import { type Option, None, Some } from "@/utils/option";
import { useCovalent } from "@/utils/store/Covalent";
import { type TokenBalancesListViewProps } from "@/utils/types/organisms.types";

type Story = StoryObj<typeof TokenBalancesListView>;

const meta: Meta<typeof TokenBalancesListView> = {
    title: "Organisms/Token Balances",
    component: TokenBalancesListView,
};

export default meta;

export const TokenBalancesList: Story = {
    args: {
        chain_names: ["eth-mainnet"],
        address: "0x972B8FAD70de6e430D8b368198AbFF1E42eFf022",
        mask_balances: false,
        hide_small_balances: false,
    },
};

export const MultiChainTokenBalancesList: Story = {
    args: {
        chain_names: [
            "eth-mainnet",
            "matic-mainnet",
            "bsc-mainnet",
            "avalanche-mainnet",
            "optimism-mainnet",
        ],
        address: "0xf8cb94cda3552a427b87d8beb04729beb93dac5c",
        mask_balances: false,
        hide_small_balances: false,
    },
    render: ({
        chain_names,
        address,
        mask_balances,
        hide_small_balances,
    }: TokenBalancesListViewProps) => {
        const [resolvedAddress, setAddress] = useState<Option<string>>(None);
        const { covalentClient } = useCovalent();

        useEffect(() => {
            (async () => {
                try {
                    const walletActivityResp =
                        await covalentClient.BaseService.getAddressActivity(
                            address.trim()
                        );
                    setAddress(new Some(walletActivityResp.data.address));
                } catch (exception) {
                    setAddress(new Some(""));
                }
            })();
        }, [address]);

        return resolvedAddress.match({
            None: () => <></>,
            Some: (address) => {
                return (
                    <div>
                        <TokenBalancesListView
                            chain_names={chain_names}
                            address={address}
                            mask_balances={mask_balances}
                            hide_small_balances={hide_small_balances}
                        />
                    </div>
                );
            },
        });
    },
};
