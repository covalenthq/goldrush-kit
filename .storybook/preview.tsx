import React from "react";
import { Preview } from "@storybook/react";
import "../src/tailwind-output.css";
import { GoldRushProvider } from "../src/utils/store";
import { defaultTheme } from "./manager";

const Story = ({ storyFn }) => storyFn();
const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        docs: {
            theme: defaultTheme,
        },
    },
    decorators: [
        (storyFn) => (
            <GoldRushProvider
                apikey={import.meta.env.STORYBOOK_COVALENT_API_KEY}
                newTheme={{
                    borderRadius: 10,
                }}
            >
                <Story storyFn={storyFn} />
            </GoldRushProvider>
        ),
    ],
};

export default preview;
