import { z } from "zod";

// Query string of GET /api/groups. Query values arrive as strings, so isPrivate
// is "0" or "1" on the wire and a number after parsing.
export const groupListQuerySchema = z.object({
  q: z.string().trim().max(100, "Use 100 characters or fewer").optional(),
  isPrivate: z
    .enum(["0", "1"], { error: "isPrivate must be 0 or 1" })
    .transform((value) => {
      return Number(value);
    })
    .optional(),
});

export type GroupListQuery = z.infer<typeof groupListQuerySchema>;
