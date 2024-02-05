import { type Meta, type StoryObj } from "@storybook/react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { updateTheme } from "@/utils/functions";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { COLORS, GRK_SIZES } from "@/utils/constants/shared.constants";

const meta: Meta<typeof Button> = {
    title: "Theme Config",
    component: Button,
    argTypes: {
        default_color: {
            options: [
                "slate",
                "stone",
                "red",
                "orange",
                "amber",
                "yellow",
                "lime",
                "green",
                "emerald",
                "cyan",
                "sky",
                "blue",
                "indigo",
                "violet",
                "purple",
                "fuchsia",
                "pink",
                "rose",
            ],
            control: { type: "radio" },
        },
        border_radius: {
            options: ["none", "small", "medium", "large", "full"],
            control: { type: "radio" },
        },
    },
};
export default meta;

type Story = StoryObj<typeof Button>;

const renderDarkLightMode = (changeDarkMode: any, changeLightMode: any) => {
    return (
        <div>
            <p className="dark:text-white">
                <strong>Pick dark/light mode</strong>
            </p>
            <div className="flex gap-5">
                <Button variant={"default"} onClick={changeDarkMode}>
                    Dark
                </Button>
                <Button variant={"default"} onClick={changeLightMode}>
                    Light
                </Button>
            </div>
        </div>
    );
};

const renderColors = (changeOnlyColor: any) => {
    const color500Array = Object.keys(COLORS).map((key) => [
        key,
        COLORS[key]["500"],
    ]);
    return (
        <div>
            <p className="dark:text-white">
                <strong>Pick a color</strong>
            </p>
            <div className="flex flex-wrap gap-5">
                {color500Array.map((color, index) => {
                    return (
                        <div
                            style={{
                                backgroundColor: color[1],
                            }}
                            key={index}
                            onClick={() => changeOnlyColor(color[0])}
                            className={`neo-shadow cursor-pointer rounded p-2 text-white`}
                        >
                            {" "}
                            {color[0]}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const renderButtons = () => {
    return (
        <div>
            <p className="dark:text-white">
                <strong>Buttons</strong>
            </p>
            <div className="flex gap-4">
                <div>
                    <p>Default</p>
                    <Button variant={"default"}>Button</Button>
                </div>

                <div>
                    <p>Secondary</p>
                    <Button variant={"secondary"}>Button</Button>
                </div>

                <div>
                    <p>Link</p>
                    <Button variant={"link"}>Button</Button>
                </div>

                <div>
                    <p>Destructive</p>
                    <Button variant={"destructive"}>Button</Button>
                </div>

                <div>
                    <p>Outline</p>
                    <Button variant={"outline"}>Button</Button>
                </div>

                <div>
                    <p>Ghost</p>
                    <Button variant={"ghost"}>Button</Button>
                </div>
                <div>
                    <p>Disabled</p>
                    <Button disabled>Button</Button>
                </div>
            </div>
        </div>
    );
};

const renderBadges = () => {
    return (
        <div>
            <div className="dark:text-white">
                <strong>Badges</strong>
            </div>
            <div className="flex gap-4">
                <div className="">
                    <p>Default</p>
                    <Badge variant={"default"}>Badge</Badge>
                </div>

                <div>
                    <p>Secondary</p>
                    <Badge variant={"secondary"}>Badge</Badge>
                </div>
                <div>
                    <p>Destructive</p>
                    <Badge variant={"destructive"}>Badge</Badge>
                </div>
                <div>
                    <p>Outline</p>
                    <Badge variant={"outline"}>Badge</Badge>
                </div>
            </div>
        </div>
    );
};

const renderCheckboxes = () => {
    return (
        <div>
            <div className="dark:text-white">
                <strong>Checkboxes</strong>
            </div>
            <div className="flex gap-4">
                <div>
                    <p>Default</p>
                    <Checkbox>Checkbox</Checkbox>
                </div>

                <div>
                    <p>Checked</p>
                    <Checkbox checked>Checkbox</Checkbox>
                </div>

                <div>
                    <p>Disabled</p>
                    <Checkbox disabled>Checkbox</Checkbox>
                </div>
            </div>
        </div>
    );
};

const renderSkeleton = () => {
    return (
        <div>
            <div className="dark:text-white">
                <strong>Skeleton</strong>
            </div>
            <div className="flex gap-4">
                <div>
                    <p>Large</p>
                    <Skeleton size={GRK_SIZES.LARGE} />
                </div>
                <div>
                    <p>Medium</p>
                    <Skeleton size={GRK_SIZES.MEDIUM} />
                </div>
                <div>
                    <p>Small</p>
                    <Skeleton size={GRK_SIZES.SMALL} />
                </div>
                <div>
                    <p>Extra Small</p>
                    <Skeleton size={GRK_SIZES.EXTRA_SMALL} />
                </div>
                <div>
                    <p>Extra Extra Small</p>
                    <Skeleton size={GRK_SIZES.EXTRA_EXTRA_SMALL} />
                </div>
            </div>
        </div>
    );
};

const renderNeoBrutalism = ({ changeToNeo, changeToClassic }: any) => {
    return (
        <div className="flex gap-5">
            <Button onClick={() => changeToNeo()} variant={"default"}>
                Change to Neo
            </Button>
            <Button onClick={() => changeToClassic()} variant={"default"}>
                Change to Classic
            </Button>
        </div>
    );
};

export const ThemeConfig: Story = {
    render: ({ default_color, border_radius }) => {
        function changeColor(accentcolor: string, border_radius: string) {
            const theme = {
                accentcolor: accentcolor,
                borderradius: border_radius,
            };
            updateTheme(theme);
        }

        function changeOnlyColor(accentcolor: string) {
            const theme = {
                accentcolor: accentcolor,
            };
            updateTheme(theme);
        }
        function changeDarkMode() {
            const body = document.body;
            const root = document.documentElement;

            body.classList.add("dark");
            root.classList.add("dark");
        }
        function changeLightMode() {
            const body = document.body;
            const root = document.documentElement;

            body.classList.remove("dark");
            root.classList.remove("dark");
        }

        function changeToNeo() {
            const theme = {
                backgroundColor: {
                    light: "#eff6ff",
                    dark: "#1d4ed8",
                },
                borderColor: {
                    light: "#bfdbfe",
                    dark: "#1e40af",
                },
                secondary: {
                    light: "#64748b",
                },
                surfaceColor: {
                    light: "#bfdbfe",
                    dark: "#bfdbfe",
                },
                secondaryColor: {
                    light: "#64748b",
                    dark: "#64748b",
                },
            };
            updateTheme(theme);
            const body = document.body;
            body.classList.add("neo");
        }

        function changeToClassic() {
            const theme = {
                backgroundColor: {
                    light: "#ffffff",
                    dark: "#030711",
                },
                borderColor: {
                    light: "#e5e7eb",
                    dark: "#1f2937",
                },
                surfaceColor: {
                    light: "#e5e7eb",
                    dark: "#e5e7eb",
                },
                secondaryColor: {
                    light: "#94a3b8",
                    dark: "#94a3b8",
                },
            };
            updateTheme(theme);
            const body = document.body;
            body.classList.remove("neo");
        }

        useEffect(() => {
            // changeSurfaceColor();
        }, []);

        useEffect(() => {
            changeColor(default_color, border_radius);
        }, [default_color, border_radius]);

        return (
            <div className="space-y-8 rounded p-10 text-black dark:text-white">
                {renderDarkLightMode(changeDarkMode, changeLightMode)}
                {renderColors(changeOnlyColor)}
                {/* {renderSurfaceColors(changeSurfaceColor)} */}
                {renderNeoBrutalism({ changeToClassic, changeToNeo })}
                {renderButtons()}
                {renderBadges()}
                {renderCheckboxes()}
                {renderSkeleton()}
            </div>
        );
    },
    args: {
        default_color: "red",
        border_radius: "medium",
    },
};
