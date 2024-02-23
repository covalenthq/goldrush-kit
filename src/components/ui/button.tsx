import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../utils/functions";

const buttonVariants = cva(
    "inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-20 disabled:cursor-not-allowed rounded",
    {
        variants: {
            variant: {
                default:
                    "bg-primary-light text-slate-100 dark:text-slate-900 shadow hover:bg-primary-light-300",
                primary:
                    "bg-primary-light-100 text-slate-900 shadow hover:bg-primary-light-300",
                destructive:
                    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
                outline:
                    "border border-primary-light dark:text-slate-50 bg-transparent shadow-sm hover:bg-primary-light",
                secondary:
                    "bg-accent/30 text-secondary-foreground dark:text-white shadow-sm hover:bg-accent/20",
                ghost: "hover:bg-accent dark:text-white hover:text-slate-50",
                link: "text-accent dark:text-accent decoration-accent  underline-offset-4 hover:underline",
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-10 rounded-md px-8",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
