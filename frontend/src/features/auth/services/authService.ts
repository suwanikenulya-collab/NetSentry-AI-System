import type {
  AuthUser,
  LoginCredentials,
  LoginResponse,
} from "../types/auth.types";

interface DemoAccount {
  user: AuthUser;
  password: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    user: {
      id: "user-analyst-001",
      name: "Demo Analyst",
      email: "analyst@netsentry.local",
      role: "analyst",
      initials: "DA",
    },
    password: "Demo123!",
  },
  {
    user: {
      id: "user-admin-001",
      name: "Demo Administrator",
      email: "admin@netsentry.local",
      role: "admin",
      initials: "DA",
    },
    password: "Demo123!",
  },
];

const MOCK_REQUEST_DELAY = 800;

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  await wait(MOCK_REQUEST_DELAY);

  const normalizedEmail = credentials.email
    .trim()
    .toLowerCase();

  const account = DEMO_ACCOUNTS.find(
    (demoAccount) =>
      demoAccount.user.email === normalizedEmail &&
      demoAccount.password === credentials.password,
  );

  if (!account) {
    throw new Error(
      "The email address or password is incorrect.",
    );
  }

  return {
    user: account.user,
    accessToken: "mock-access-token",
  };
}

export const authService = {
  login,
};