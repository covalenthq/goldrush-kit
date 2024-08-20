import "../src/tailwind-output.css";
import { GoldRushProvider } from "../src/utils/store";
import { defaultTheme } from "./manager";
import { type Preview } from "@storybook/react";
import React from "react";

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
                apikey={import.meta.env.STORYBOOK_GOLDRUSH_API_KEY}
                theme={{
                    borderRadius: 10,
                }}
            >
                <Story storyFn={storyFn} />
            </GoldRushProvider>
        ),
    ],
};

export default preview;
