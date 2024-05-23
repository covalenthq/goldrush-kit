import { fn } from "@storybook/test";
import { ActionableType } from "../types/shared.types";

export const storyAction = (data: unknown): ActionableType => {
    return {
        parent: "button",
        parentProps: {
            onClick: fn(() => {
                console.log(data);
            }),
            className: "hover:underline",
        },
    };
};
