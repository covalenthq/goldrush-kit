import { type Meta, type StoryObj } from "@storybook/react";
import { XYKTokenListView } from "./XYKTokenListView";

type Story = StoryObj<typeof XYKTokenListView>;

const meta: Meta<typeof XYKTokenListView> = {
    title: "Organisms/XYK",
    component: XYKTokenListView,
};

export default meta;

export const XYKTokenList: Story = {
    args: {
        chain_names: ["eth-mainnet"],
        address: "0x972B8FAD70de6e430D8b368198AbFF1E42eFf022",
        mask_balances: false,
        hide_small_balances: false,
    },
};
