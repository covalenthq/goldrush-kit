import { cn } from "@/utils/functions";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                primary:
                    "bg-primary-light dark:bg-primary-dark text-foreground-light dark:text-foreground-dark shadow hover:bg-opacity-90",
                outline:
                    "text-foreground-light dark:text-foreground-dark border bg-background-light dark:bg-background-dark hover:bg-primary-light dark:hover:bg-primary-dark border-secondary-light dark:border-secondary-dark shadow-sm",
                ghost: "hover:bg-primary-light hover:text-foreground-light dark:hover:bg-primary-dark dark:hover:text-foreground-dark",
                link: "text-primary-light dark:text-primary-dark underline-offset-4 hover:underline",
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 rounded px-3 text-xs",
                lg: "h-10 rounded px-8",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
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
