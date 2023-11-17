import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../utils/functions";

const badgeVariants = cva(
    "inline-flex items-center border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-accent text-text-color-100 dark:text-text-color-900 shadow hover:bg-accent/80",
                secondary:
                    "border-transparent bg-accent-foreground text-secondary-foreground hover:bg-accent-foreground/80",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
                outline:
                    "text-foreground border-accent-foreground hover:bg-accent-foreground/10 dark:text-white",
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
