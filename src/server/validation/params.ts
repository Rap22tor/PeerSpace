// Route params are strings. Returns the positive integer id, or undefined (answer 400 or 404 then).
export function parseIdParam(value: unknown): number | undefined {
  if (typeof value !== "string" || !/^[1-9]\d{0,14}$/.test(value)) {
    return undefined;
  }
  return Number(value);
}
