// Create-group form validators: an error message, or undefined if valid. Rules live in src/shared/groupSchemas.ts.

import {
  groupCapacitySchema,
  groupDescriptionSchema,
  groupTagsSchema,
  groupTitleSchema,
} from "../../../shared/groupSchemas";
import { firstError } from "./firstError";

export function validateGroupTitle(title: string): string | undefined {
  return firstError(groupTitleSchema, title);
}

export function validateGroupDescription(
  description: string,
): string | undefined {
  return firstError(groupDescriptionSchema, description);
}

export function validateGroupTags(tags: string): string | undefined {
  return firstError(groupTagsSchema, tags);
}

// A blank value must not become 0 (Number("") is 0), so it counts as not a number.
export function validateGroupCapacity(value: string): string | undefined {
  const capacity = value.trim() === "" ? Number.NaN : Number(value);
  return firstError(groupCapacitySchema, capacity);
}
