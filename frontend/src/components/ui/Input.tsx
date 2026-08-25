import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      error,
      helperText,
      leftIcon,
      rightElement,
      className,
      required,
      disabled,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const descriptionId = `${inputId}-description`;

    const description = error || helperText;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-muted"
          >
            {label}

            {required && (
              <span className="ml-1 text-critical" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle"
            >
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            required={required}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={description ? descriptionId : undefined}
            className={cn(
              "h-10 w-full rounded-md border bg-surface-muted px-3",
              "text-sm text-foreground placeholder:text-subtle",
              "transition-colors duration-200",
              "focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
              "disabled:cursor-not-allowed disabled:opacity-50",
              leftIcon && "pl-10",
              rightElement && "pr-10",
              error
                ? "border-critical focus:border-critical focus:ring-critical"
                : "border-border-strong",
              className,
            )}
            {...props}
          />

          {rightElement && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightElement}
            </span>
          )}
        </div>

        {description && (
          <p
            id={descriptionId}
            className={cn(
              "mt-1.5 text-xs",
              error ? "text-critical" : "text-subtle",
            )}
          >
            {description}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";