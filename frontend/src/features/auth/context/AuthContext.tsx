import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authService } from "../services/authService";
import type {
  AuthUser,
  LoginCredentials,
  LoginResponse,
} from "../types/auth.types";

interface AuthContextValue {
  session: LoginResponse | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = "netsentry-demo-session";

const AuthContext = createContext<
  AuthContextValue | undefined
>(undefined);

function clearStoredSession() {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_KEY);
}

function readStoredSession(): LoginResponse | null {
  const storedSession =
    localStorage.getItem(STORAGE_KEY) ??
    sessionStorage.getItem(STORAGE_KEY);

  if (!storedSession) {
    return null;
  }

  try {
    const parsedSession = JSON.parse(
      storedSession,
    ) as LoginResponse;

    if (
      !parsedSession.user ||
      !parsedSession.accessToken
    ) {
      throw new Error("Invalid stored session");
    }

    return parsedSession;
  } catch {
    clearStoredSession();
    return null;
  }
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [session, setSession] =
    useState<LoginResponse | null>(readStoredSession);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const response =
        await authService.login(credentials);

      clearStoredSession();

      const selectedStorage = credentials.rememberMe
        ? localStorage
        : sessionStorage;

      selectedStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(response),
      );

      setSession(response);
    },
    [],
  );

  const logout = useCallback(() => {
    clearStoredSession();
    setSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isAuthenticated: Boolean(session),
      login,
      logout,
    }),
    [login, logout, session],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider.",
    );
  }

  return context;
}