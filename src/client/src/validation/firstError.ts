import type { ZodType } from "zod";

// The first error message of a schema check, or undefined if the value is valid.
export function firstError(
  schema: ZodType,
  value: unknown,
): string | undefined {
  const result = schema.safeParse(value);
  if (result.success) {
    return undefined;
  }
  return result.error.issues[0]?.message;
}
