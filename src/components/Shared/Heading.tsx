import { type HeadingProps } from "@/utils/types/shared.types";

export const Heading: React.FC<HeadingProps> = ({
    children,
    size,
    ...props
}) => {
    switch (size) {
        case 1: {
            return (
                <h1
                    className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
                    {...props}
                >
                    {children}
                </h1>
            );
        }
        case 2: {
            return (
                <h2
                    className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
                    {...props}
                >
                    {children}
                </h2>
            );
        }
        case 3: {
            return (
                <h3
                    className="scroll-m-20 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
                    {...props}
                >
                    {children}
                </h3>
            );
        }
        case 4: {
            return (
                <h4
                    className="scroll-m-20 text-xl font-semibold tracking-tight"
                    {...props}
                >
                    {children}
                </h4>
            );
        }
    }
};
