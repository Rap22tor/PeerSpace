import { z } from "zod";

// One definition of the auth rules, used by the client forms (fast feedback)
// and by the server routes (the authority). Messages are shown to the user.

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

export const userNameSchema = z
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

// Sign in: only check that something was entered. The rules may change over
// time, and existing accounts must still be able to sign in.
export const loginPasswordSchema = z
  .string({ error: "Enter your password" })
  .min(1, "Enter your password")
  .refine((value) => {
    return byteLength(value) <= MAX_PASSWORD_BYTES;
  }, "Password is too long");

export const registerSchema = z.object({
  userName: userNameSchema,
  email: emailSchema,
  password: registerPasswordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
});

// Inferred, so the types can never drift from the rules. Type aliases (not
// interfaces) so they can be passed as a request body.
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
