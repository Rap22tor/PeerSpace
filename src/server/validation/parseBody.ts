import type { ZodType } from "zod";

export type ParseResult<T> =
  { ok: true; value: T } | { ok: false; fields: Record<string, string> };

// Checks a body against a schema. Failure gives one message per field (for a 400). Extra keys are dropped.
export function parseBody<T>(
  schema: ZodType<T>,
  body: unknown,
): ParseResult<T> {
  const result = schema.safeParse(body);
  if (result.success) {
    return { ok: true, value: result.data };
  }

  const fields: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const field = String(issue.path[0] ?? "body");
    if (fields[field] === undefined) {
      fields[field] = issue.message;
    }
  }
  return { ok: false, fields };
}
