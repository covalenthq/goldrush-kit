/* eslint-disable prettier/prettier */

import { useGoldRush } from "@/utils/store";
import { Input } from "../ui/input";
import {
    type GoldRushThemeColorType,
    type GoldRushThemeType,
} from "@/utils/types/store.types";
import { TypographyH3, TypographyH4 } from "../ui/typography";
import { Button } from "../ui/button";

export const ThemeConfig: React.FC = () => {
    const { theme, updateThemeHandler, resetThemeHandler } = useGoldRush();

    return (
        <div className="flex w-full flex-col gap-16 p-10">
            <div className="flex flex-col items-center gap-16 lg:flex-row">
                <div className="w-2/12">
                    <TypographyH3>
                        Theme
                        <br />
                        Settings
                    </TypographyH3>
                </div>

                <div className="10/12">
                    <div className="grid grid-cols-2 items-center gap-x-8">
                        <p className="">Dark Mode</p>
                        <div className="w-4">
                            <Input
                                type="checkbox"
                                checked={theme.mode === "dark"}
                                onChange={() =>
                                    updateThemeHandler({
                                        mode:
                                            theme.mode === "dark"
                                                ? "light"
                                                : "dark",
                                    })
                                }
                                className="cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 items-center gap-x-8">
                        <p className="">Border Radius</p>
                        <Input
                            type="number"
                            value={theme.borderRadius}
                            onChange={(e) =>
                                updateThemeHandler({
                                    borderRadius: +e.target.value,
                                })
                            }
                            className="rounded"
                        />
                    </div>
                </div>

                <div className="ml-auto">
                    <Button onClick={resetThemeHandler}>
                        Reset to Default
                    </Button>
                </div>
            </div>

            {(["light", "dark"] as GoldRushThemeType["mode"][]).map((mode) => (
                <div key={mode} className="flex flex-col gap-16 lg:flex-row">
                    <div className="w-full lg:w-2/12">
                        <TypographyH3>
                            <span className="capitalize"> {mode}</span>
                            <br />
                            Theme
                        </TypographyH3>
                    </div>

                    <div className="flex w-full flex-col justify-between lg:w-3/12">
                        {(
                            [
                                "primary",
                                "secondary",
                                "foreground",
                                "background",
                            ] as Array<keyof GoldRushThemeColorType>
                        ).map((shade) => (
                            <div
                                key={shade}
                                className="flex items-center justify-between"
                            >
                                <p className="pt-1 capitalize">{shade} Color</p>
                                <div className="h-8 w-8">
                                    <Input
                                        type="color"
                                        value={theme.colors[mode]?.[shade]}
                                        onChange={(e) =>
                                            updateThemeHandler({
                                                colors: {
                                                    [mode]: {
                                                        [shade]: e.target.value,
                                                    },
                                                },
                                            })
                                        }
                                        className="!m-0 cursor-pointer !border-none !p-0"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="w-full lg:w-3/12">
                        <div className="mx-auto w-64 overflow-hidden rounded border border-light dark:border-dark">
                            {[100, 200, 300, 400, 500, 600, 700, 800, 900].map(
                                (shade) => (
                                    <div
                                        key={shade}
                                        className={`flex justify-between bg-primary-${mode}-${shade} px-2`}
                                    >
                                        <p className="text-foreground-light">
                                            {mode} {shade}
                                        </p>

                                        <p className="text-foreground-dark">
                                            {mode} {shade}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    <div
                        className={`m-auto flex min-h-40 w-full items-center justify-center rounded lg:w-3/12 text-foreground-${mode} border border-secondary-${mode} bg-background-${mode}`}
                    >
                        <div>
                            <TypographyH4>Preview</TypographyH4>
                            <div
                                className={`w-18 h-1 bg-primary-${mode} mx-auto mt-2 rounded`}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
