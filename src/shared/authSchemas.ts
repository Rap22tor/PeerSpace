import { z } from "zod";

// The auth rules, shared by the client forms and the server routes (the authority).

export const MAX_USERNAME_LENGTH = 50;
export const MAX_EMAIL_LENGTH = 254;
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_BYTES = 72; // bcrypt only uses the first 72 bytes
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_NUMBER_PATTERN = /\d/;

const PASSWORD_RULES_MESSAGE = "Choose a password that meets the rules";

function byteLength(value: string): number {
  return new TextEncoder().encode(value).length;
}

export const usernameSchema = z
  .string({ error: "Enter your Username" })
  .trim()
  .min(1, "Enter your Username")
  .max(MAX_USERNAME_LENGTH, `Use ${MAX_USERNAME_LENGTH} characters or fewer`);

export const emailSchema = z
  .string({ error: "Enter your email" })
  .trim()
  .min(1, "Enter your email")
  .max(MAX_EMAIL_LENGTH, "Enter a valid email address")
  .regex(EMAIL_PATTERN, "Enter a valid email address");

// Registration: the password has to meet every rule.
export const registerPasswordSchema = z
  .string({ error: "Enter a password" })
  .min(1, "Enter a password")
  .min(MIN_PASSWORD_LENGTH, PASSWORD_RULES_MESSAGE)
  .regex(PASSWORD_NUMBER_PATTERN, PASSWORD_RULES_MESSAGE)
  .refine((value) => {
    return byteLength(value) <= MAX_PASSWORD_BYTES;
  }, `Use ${MAX_PASSWORD_BYTES} bytes or fewer`);

// Sign in only checks that something was entered, so old accounts can still get in.
export const loginPasswordSchema = z
  .string({ error: "Enter your password" })
  .min(1, "Enter your password")
  .refine((value) => {
    return byteLength(value) <= MAX_PASSWORD_BYTES;
  }, "Password is too long");

export const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: registerPasswordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
});

// Inferred types, as aliases (not interfaces) so they can be sent as a request body.
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
