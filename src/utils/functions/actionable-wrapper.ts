import { type ActionableType } from "../types/shared.types";
import { createElement } from "react";

export const actionableWrapper = <
    T extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
>(
    actionable: ActionableType<T> | null,
    children: React.ReactNode
): React.ReactNode => {
    if (!actionable) {
        return children;
    }

    return createElement(actionable.parent, actionable.parentProps, children);
};
