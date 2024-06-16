import { type Meta, type StoryObj } from "@storybook/react";
import { NFT as NFTComponent } from "./NFT";
import { storyAction } from "@/utils/functions";

const meta: Meta<typeof NFTComponent> = {
    title: "Atoms/NFT",
    component: NFTComponent,
};

export default meta;

type Story = StoryObj<typeof NFTComponent>;

export const NFT: Story = {
    args: {
        src: "https://nftassets.covalenthq.com/cdn-cgi/image/width=512,fit/bbf729c26915a469c16249db7c8af10e3db93765d26be4ec54426d0e5dc511d0.png",
        attributes: [
            {
                trait_type: "Background",
                value: "Purple Pink",
            },
            {
                trait_type: "Skin Tone",
                value: "Deep Neutral",
            },
            {
                trait_type: "Eyes",
                value: "Brown Straight",
            },
            {
                trait_type: "Facial Features",
                value: "Feline Eyes",
            },
            {
                trait_type: "Hairstyle",
                value: "Silver",
            },
            {
                trait_type: "Clothes",
                value: "Polka Dot Top",
            },
            {
                trait_type: "Earrings",
                value: "Flower Power",
            },
            {
                trait_type: "Mouth",
                value: "Slight Smile",
            },
            {
                trait_type: "Lips Color",
                value: "Passion Red",
            },
        ],
        actionable_contract: (address: string) => storyAction(address),
    },
};
