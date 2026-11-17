import type { ZodType } from "zod";

export type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; fields: Record<string, string> };

// Checks an unknown request body against a schema. On failure it returns one
// message per field, ready for a 400 `{ error, fields }` response. Extra keys
// in the body are dropped, and strings come back trimmed where the schema says so.
//
//   const result = parseBody(registerSchema, req.body);
//   if (!result.ok) {
//     res.status(400).json({ error: "Invalid input", fields: result.fields });
//     return;
//   }
//   const { userName, email, password } = result.value;
export function parseBody<T>(schema: ZodType<T>, body: unknown): ParseResult<T> {
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
