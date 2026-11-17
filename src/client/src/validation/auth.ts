// Client-side validation for the sign in and register forms. It only gives
// faster feedback: the server validates every field again and stays the
// authority. Each validator returns an error message, or undefined if valid.

const MAX_NAME_LENGTH = 50;
const MAX_EMAIL_LENGTH = 254;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MIN_PASSWORD_LENGTH = 8;
const STRONG_PASSWORD_LENGTH = 12;

export interface PasswordRule {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

// Keep in sync with the rules the server enforces.
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
      return /\d/.test(password);
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

export function validateName(name: string): string | undefined {
  const trimmed = name.trim();
  if (trimmed === "") {
    return "Enter your Username";
  }
  if (trimmed.length > MAX_NAME_LENGTH) {
    return `Use ${MAX_NAME_LENGTH} characters or fewer`;
  }

  // TODO validate unique username

  return undefined;
}

export function validateEmail(email: string): string | undefined {
  const trimmed = email.trim();
  if (trimmed === "") {
    return "Enter your email";
  }
  if (trimmed.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(trimmed)) {
    return "Enter a valid email address";
  }
  return undefined;
}

// Registration: the password has to meet every rule.
export function validateRegisterPassword(password: string): string | undefined {
  if (password === "") {
    return "Enter a password";
  }
  const allMet = passwordRules.every((rule) => {
    return rule.test(password);
  });
  if (!allMet) {
    return "Choose a password that meets the rules";
  }
  return undefined;
}

// Sign in: only check that something was entered. The rules may change over
// time, and existing accounts must still be able to sign in.
export function validateLoginPassword(password: string): string | undefined {
  if (password === "") {
    return "Enter your password";
  }
  return undefined;
}
