import { type AddressAvatarProps } from "@/utils/types/atoms.types";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { COLORS, GRK_SIZES } from "@/utils/constants/shared.constants";
import { useTheme } from "@/utils/store";
import { Button } from "../ui/button";

export const ThemeConfigView: React.FC<AddressAvatarProps> = ({}) => {
    const { changeAccent, changeMode, changeStyle } = useTheme();

    const ACCENTS_500 = useMemo<string[][]>(() => {
        return Object.keys(COLORS).map((key) => [key, COLORS[key]["500"]]);
    }, []);

    return (
        <div className="space-y-8 rounded p-10 text-black dark:text-white">
            <div>
                <p className="dark:text-white">
                    <strong>Pick dark/light mode</strong>
                </p>
                <div className="flex gap-5">
                    <Button
                        variant={"default"}
                        onClick={() => changeMode("dark")}
                    >
                        Dark
                    </Button>
                    <Button
                        variant={"default"}
                        onClick={() => changeMode("light")}
                    >
                        Light
                    </Button>
                </div>
            </div>

            <div>
                <p className="dark:text-white">
                    <strong>Pick an accent color</strong>
                </p>
                <div className="flex flex-wrap gap-5">
                    {ACCENTS_500.map((color, index) => {
                        return (
                            <div
                                style={{
                                    backgroundColor: color[1],
                                }}
                                key={index}
                                onClick={() => changeAccent(color[0])}
                                className={`neo-shadow cursor-pointer rounded p-2 text-white`}
                            >
                                {color[0]}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div>
                <p className="dark:text-white">
                    <strong>Pick a style</strong>
                </p>
                <div className="flex gap-5">
                    <Button
                        onClick={() => changeStyle("neo")}
                        variant={"default"}
                    >
                        Change to Neo
                    </Button>
                    <Button
                        onClick={() => changeStyle("classic")}
                        variant={"default"}
                    >
                        Change to Classic
                    </Button>
                </div>
            </div>

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
        </div>
    );
};
