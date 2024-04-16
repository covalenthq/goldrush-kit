import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/functions";

const badgeVariants = cva(
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary-light dark:bg-primary-dark text-foreground-light dark:text-foreground-dark shadow hover:bg-opacity-80",
                secondary:
                    "border-transparent bg-secondary-light dark:bg-secondary-dark text-foreground-light dark:text-foreground-dark hover:bg-opacity-80",
                destructive:
                    "border-transparent bg-red-500 text-white shadow hover:bg-opacity-80",
                outline: "text-foreground-light dark:text-foreground-dark",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
