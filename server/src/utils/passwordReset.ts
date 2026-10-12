import { createHash, randomBytes } from "crypto";

// how long a password reset link stays valid
export const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;

// minimum time between two reset requests for the same account.
// keep in sync with the client cooldown
// (client/hooks/auth/useForgotPassword.ts -> COOLDOWN_SECONDS)
export const RESET_COOLDOWN_MS = 3 * 60 * 1000;

// only the hash is persisted; the raw token travels in the email link
export const hashResetToken = (rawToken: string): string =>
  createHash("sha256").update(rawToken).digest("hex");

export const generateResetToken = (): {
  rawToken: string;
  tokenHash: string;
} => {
  const rawToken = randomBytes(32).toString("hex");

  return { rawToken, tokenHash: hashResetToken(rawToken) };
};
