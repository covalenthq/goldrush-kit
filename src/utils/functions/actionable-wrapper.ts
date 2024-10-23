import { type ActionableType } from "../types/shared.types";
import { createElement, type ElementType } from "react";

export const actionableWrapper = <T extends ElementType>(
    actionable: ActionableType<T> | null,
    children: React.ReactNode,
): React.ReactNode => {
    if (!actionable) {
        return children;
    }

    return createElement(actionable.parent, actionable.parentProps, children);
};
