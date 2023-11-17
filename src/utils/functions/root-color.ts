import { COLORS } from "../constants/shared.constants";

export const rootColor = () => {
    const root = document.documentElement;
    const classes = root.classList;
    let rootColor;
    classes.forEach((className) => {
        if (className !== "dark" && COLORS[className]) {
            rootColor = className;
        }
    });
    return rootColor;
};
