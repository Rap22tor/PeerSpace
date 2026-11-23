// Route params (req.params.x) are always strings. Returns the positive integer
// id, or undefined if the value is not one. Answer 400 (or 404) when undefined.
//
//   const groupId = parseIdParam(req.params.groupId);
export function parseIdParam(value: unknown): number | undefined {
  if (typeof value !== "string" || !/^[1-9]\d{0,14}$/.test(value)) {
    return undefined;
  }
  return Number(value);
}
