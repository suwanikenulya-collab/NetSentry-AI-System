import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "../../lib/cn";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";

type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
}

const baseStyles = [
  "inline-flex items-center justify-center gap-2",
  "rounded-md font-medium",
  "transition-colors duration-200",
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-primary",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-background",
  "disabled:pointer-events-none",
  "disabled:opacity-50",
].join(" ");

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover",

  secondary:
    "border border-border-strong bg-surface-muted text-foreground hover:bg-surface-hover",

  outline:
    "border border-primary bg-transparent text-primary hover:bg-primary/10",

  ghost:
    "bg-transparent text-muted hover:bg-surface-hover hover:text-foreground",

  danger:
    "bg-critical text-white hover:bg-red-400",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
  icon: "h-10 w-10",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      disabled,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <LoaderCircle
            aria-hidden="true"
            className="h-4 w-4 animate-spin"
          />
        ) : (
          leftIcon
        )}

        {children}
      </button>
    );
  },
);

Button.displayName = "Button";