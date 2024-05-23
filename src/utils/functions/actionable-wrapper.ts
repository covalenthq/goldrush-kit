import { createElement } from "react";
import { type ActionableType } from "../types/shared.types";

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
