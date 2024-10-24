import { cn } from "@/utils/functions";
import { type VariantProps } from "class-variance-authority";
import * as React from "react";

const badgeVariants = ({
    variant = "default",
    className = "",
}: {
    variant?:
        | "default"
        | "secondary"
        | "danger"
        | "success"
        | "outline"
        | "ghost";
    className?: string;
}): string => {
    const variants: Record<string, string> = {
        default:
            "border border-transparent bg-primary-light dark:bg-primary-dark text-foreground-light dark:text-foreground-dark shadow hover:bg-opacity-80",
        secondary:
            "border border-transparent bg-secondary-light dark:bg-secondary-dark text-foreground-light dark:text-foreground-dark hover:bg-opacity-80",
        danger: "border border-transparent bg-danger text-white shadow hover:bg-opacity-80",
        success:
            "border border-transparent bg-success text-white shadow hover:bg-opacity-80",
        outline:
            "border border-secondary-light dark: border-secondary-dark text-foreground-light dark:text-foreground-dark",
        ghost: "text-foreground-light dark:text-foreground-dark",
    };

    return cn(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className,
    );
};

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
