import { hslToHex } from ".";

export const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str?.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        color += ("00" + value?.toString(16)).substr(-2);
    }
    return hslToHex(hash % 360, 50, 50);
};
