// Client-side validation for the sign in and register forms. It only gives
// faster feedback: the server validates every field again and stays the
// authority. The rules live in src/shared/authSchemas.ts, so both sides use
// the same ones. Each validator returns an error message, or undefined if valid.

import type { ZodType } from "zod";
import {
  emailSchema,
  loginPasswordSchema,
  MIN_PASSWORD_LENGTH,
  PASSWORD_NUMBER_PATTERN,
  registerPasswordSchema,
  usernameSchema,
} from "../../../shared/authSchemas";

export { MIN_PASSWORD_LENGTH };

const STRONG_PASSWORD_LENGTH = 12;

export interface PasswordRule {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

// Only for the checklist in the UI. The schema in shared/ is what enforces them.
export const passwordRules: readonly PasswordRule[] = [
  {
    id: "length",
    label: `At least ${MIN_PASSWORD_LENGTH} characters`,
    test: (password) => {
      return password.length >= MIN_PASSWORD_LENGTH;
    },
  },
  {
    id: "number",
    label: "One number",
    test: (password) => {
      return PASSWORD_NUMBER_PATTERN.test(password);
    },
  },
];

export const PASSWORD_HINT = `At least ${MIN_PASSWORD_LENGTH} characters, with one number.`;

// One point per met rule, plus one if all are met and the password is long.
export const MAX_PASSWORD_STRENGTH = passwordRules.length + 1;

export function getPasswordStrength(password: string): number {
  const metCount = passwordRules.filter((rule) => {
    return rule.test(password);
  }).length;
  const allMet = metCount === passwordRules.length;
  if (allMet && password.length >= STRONG_PASSWORD_LENGTH) {
    return metCount + 1;
  }
  return metCount;
}

function firstError(schema: ZodType, value: string): string | undefined {
  const result = schema.safeParse(value);
  if (result.success) {
    return undefined;
  }
  return result.error.issues[0]?.message;
}

export function validateName(name: string): string | undefined {
  // TODO validate unique username (needs the server: 409 on register)
  return firstError(usernameSchema, name);
}

export function validateEmail(email: string): string | undefined {
  return firstError(emailSchema, email);
}

export function validateRegisterPassword(password: string): string | undefined {
  return firstError(registerPasswordSchema, password);
}

export function validateLoginPassword(password: string): string | undefined {
  return firstError(loginPasswordSchema, password);
}
