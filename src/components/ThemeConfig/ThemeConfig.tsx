/* eslint-disable prettier/prettier */

import { useGoldRush } from "@/utils/store";
import { Input } from "../ui/input";
import { type GoldRushThemeType } from "@/utils/types/store.types";
import { TypographyH3, TypographyH4 } from "../ui/typography";

export const ThemeConfig: React.FC = () => {
    const { theme, handleUpdateTheme } = useGoldRush();

    return (
        <div className="grid grid-cols-4 gap-16 rounded p-10">
            <TypographyH3>
                Theme
                <br />
                Settings
            </TypographyH3>

            <div>
                <div className="grid grid-cols-2 items-center gap-x-8">
                    <p className="">Dark Mode</p>
                    <div className="w-4">
                        <Input
                            type="checkbox"
                            checked={theme.mode === "dark"}
                            onChange={() =>
                                handleUpdateTheme({
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
                            handleUpdateTheme({
                                borderRadius: +e.target.value,
                            })
                        }
                        className="rounded"
                    />
                </div>
            </div>

            <span />
            <span />

            {(["light", "dark"] as GoldRushThemeType["mode"][]).map((mode) => (
                <>
                    <TypographyH3>
                        <span className="capitalize"> {mode}</span>
                        <br />
                        Theme
                    </TypographyH3>

                    <div className="flex w-full flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <p className="pt-1">Accent Color</p>
                            <div className="h-8 w-8">
                                <Input
                                    type="color"
                                    value={theme.colors[mode]?.primary}
                                    onChange={(e) =>
                                        handleUpdateTheme({
                                            colors: {
                                                [mode]: {
                                                    primary: e.target.value,
                                                },
                                            },
                                        })
                                    }
                                    className="!m-0 cursor-pointer !border-none !p-0"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <p className="pt-1">Secondary Color</p>
                            <div className="h-8 w-8">
                                <Input
                                    type="color"
                                    value={theme.colors[mode]?.secondary}
                                    onChange={(e) =>
                                        handleUpdateTheme({
                                            colors: {
                                                [mode]: {
                                                    secondary: e.target.value,
                                                },
                                            },
                                        })
                                    }
                                    className="!m-0 cursor-pointer !border-none !p-0"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <p className="pt-1">Foreground Color</p>
                            <div className="h-8 w-8">
                                <Input
                                    type="color"
                                    value={theme.colors[mode]?.foreground}
                                    onChange={(e) =>
                                        handleUpdateTheme({
                                            colors: {
                                                [mode]: {
                                                    foreground: e.target.value,
                                                },
                                            },
                                        })
                                    }
                                    className="!m-0 cursor-pointer !border-none !p-0"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <p className="pt-1">Background Color</p>
                            <div className="h-8 w-8">
                                <Input
                                    type="color"
                                    value={theme.colors[mode]?.background}
                                    onChange={(e) =>
                                        handleUpdateTheme({
                                            colors: {
                                                [mode]: {
                                                    background: e.target.value,
                                                },
                                            },
                                        })
                                    }
                                    className="!m-0 cursor-pointer !border-none !p-0"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-light dark:border-dark mx-auto w-64 overflow-hidden rounded border">
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

                    <div
                        className={`flex items-center justify-center rounded text-foreground-${mode} border border-secondary-${mode} bg-background-${mode}`}
                    >
                        <div>
                            <TypographyH4>Preview</TypographyH4>
                            <div
                                className={`w-18 h-1 bg-primary-${mode} mx-auto mt-2 rounded`}
                            />
                        </div>
                    </div>
                </>
            ))}

            <div></div>
        </div>
    );
};
