import { ApiError } from "../backendRaw";

const GENERIC_ERROR_MESSAGE = "Something went wrong. Try again.";

export function getFormErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.status < 500) {
    return error.message;
  }
  return GENERIC_ERROR_MESSAGE;
}
