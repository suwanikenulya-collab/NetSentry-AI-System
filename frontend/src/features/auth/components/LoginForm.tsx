import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  CircleAlert,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { useAuth } from "../context/AuthContext";
import type {
  LoginCredentials,
  UserRole,
} from "../types/auth.types";

interface FormErrors {
  email?: string;
  password?: string;
}

const DEMO_CREDENTIALS: Record<
  UserRole,
  Pick<LoginCredentials, "email" | "password">
> = {
  analyst: {
    email: "analyst@netsentry.local",
    password: "Demo123!",
  },
  admin: {
    email: "admin@netsentry.local",
    password: "Demo123!",
  },
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formErrors, setFormErrors] =
    useState<FormErrors>({});

  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validateForm() {
    const errors: FormErrors = {};
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      errors.email = "Email address is required.";
    } else if (!EMAIL_PATTERN.test(normalizedEmail)) {
      errors.email = "Enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 8) {
      errors.password =
        "Password must contain at least 8 characters.";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setServerError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login({
        email: email.trim(),
        password,
        rememberMe,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again.";

      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function applyDemoAccount(role: UserRole) {
    const credentials = DEMO_CREDENTIALS[role];

    setEmail(credentials.email);
    setPassword(credentials.password);
    setFormErrors({});
    setServerError("");
  }

  function handleEmailChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setEmail(event.target.value);

    if (formErrors.email) {
      setFormErrors((currentErrors) => ({
        ...currentErrors,
        email: undefined,
      }));
    }

    if (serverError) {
      setServerError("");
    }
  }

  function handlePasswordChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setPassword(event.target.value);

    if (formErrors.password) {
      setFormErrors((currentErrors) => ({
        ...currentErrors,
        password: undefined,
      }));
    }

    if (serverError) {
      setServerError("");
    }
  }

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit}
      noValidate
    >
      {serverError && (
        <div
          role="alert"
          aria-live="polite"
          className="flex items-start gap-3 rounded-md border border-critical/40 bg-critical/10 p-3"
        >
          <CircleAlert
            aria-hidden="true"
            className="mt-0.5 h-4 w-4 shrink-0 text-critical"
          />

          <p className="text-sm text-red-300">
            {serverError}
          </p>
        </div>
      )}

      <Input
        label="Email address"
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="you@example.com"
        leftIcon={<Mail className="h-4 w-4" />}
        error={formErrors.email}
        autoComplete="email"
        disabled={isSubmitting}
        required
      />

      <Input
        label="Password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={handlePasswordChange}
        placeholder="Enter your password"
        leftIcon={
          <LockKeyhole className="h-4 w-4" />
        }
        rightElement={
          <button
            type="button"
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
            onClick={() =>
              setShowPassword((currentValue) => !currentValue)
            }
            className="rounded-sm text-subtle transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {showPassword ? (
              <EyeOff
                aria-hidden="true"
                className="h-4 w-4"
              />
            ) : (
              <Eye
                aria-hidden="true"
                className="h-4 w-4"
              />
            )}
          </button>
        }
        error={formErrors.password}
        autoComplete="current-password"
        disabled={isSubmitting}
        required
      />

      <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(event) =>
            setRememberMe(event.target.checked)
          }
          disabled={isSubmitting}
          className="h-4 w-4 rounded border-border-strong bg-surface-muted accent-primary"
        />

        Remember me
      </label>

      <Button
        type="submit"
        size="lg"
        isLoading={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>

      <div className="rounded-md border border-border bg-surface-muted p-3">
        <p className="text-xs font-medium uppercase tracking-wider text-subtle">
          Demo accounts
        </p>

        <p className="mt-1 text-xs text-muted">
          Select a role to fill the demonstration credentials.
        </p>

        <div className="mt-3 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => applyDemoAccount("analyst")}
          >
            Use Analyst
          </Button>

          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => applyDemoAccount("admin")}
          >
            Use Admin
          </Button>
        </div>
      </div>
    </form>
  );
}