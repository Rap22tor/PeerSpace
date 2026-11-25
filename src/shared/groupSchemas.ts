import { z } from "zod";

// Query string of GET /api/groups. isPrivate is "0" or "1" on the wire.
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

// Create-group rules, shared by the client dialog and POST /api/groups. Capacity mirrors the CHECK in schema.ts.
export const MAX_GROUP_TITLE_LENGTH = 100;
export const MAX_GROUP_DESCRIPTION_LENGTH = 1000;
export const MAX_GROUP_TAGS_LENGTH = 200;
export const MIN_GROUP_CAPACITY = 1;
export const MAX_GROUP_CAPACITY = 50;

const CAPACITY_RANGE_MESSAGE = `Choose a number between ${MIN_GROUP_CAPACITY} and ${MAX_GROUP_CAPACITY}`;

export const groupTitleSchema = z
  .string({ error: "Enter a group title" })
  .trim()
  .min(1, "Enter a group title")
  .max(
    MAX_GROUP_TITLE_LENGTH,
    `Use ${MAX_GROUP_TITLE_LENGTH} characters or fewer`,
  );

// Optional text: a missing, null or blank value is stored as null.
function optionalText(maxLength: number) {
  return z
    .string()
    .trim()
    .max(maxLength, `Use ${maxLength} characters or fewer`)
    .nullish()
    .transform((value) => {
      if (value === undefined || value === null || value === "") {
        return null;
      }
      return value;
    });
}

export const groupDescriptionSchema = optionalText(
  MAX_GROUP_DESCRIPTION_LENGTH,
);

// Free text, comma-separated by convention.
export const groupTagsSchema = optionalText(MAX_GROUP_TAGS_LENGTH);

export const groupCapacitySchema = z
  .number({ error: "Enter the maximum number of members" })
  .int(CAPACITY_RANGE_MESSAGE)
  .min(MIN_GROUP_CAPACITY, CAPACITY_RANGE_MESSAGE)
  .max(MAX_GROUP_CAPACITY, CAPACITY_RANGE_MESSAGE);

// Body of POST /api/groups. No owner or invite code, the server sets those. isPrivate has no default on purpose.
export const createGroupSchema = z.object({
  title: groupTitleSchema,
  description: groupDescriptionSchema,
  tags: groupTagsSchema,
  isPrivate: z.boolean({ error: "Choose public or private" }),
  maxCapacity: groupCapacitySchema,
});

// What the client sends. A type alias so it can be passed as a request body.
export type CreateGroupRequest = z.input<typeof createGroupSchema>;
