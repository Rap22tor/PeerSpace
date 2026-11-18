import { ApiError } from "../backendRaw";

const GENERIC_ERROR_MESSAGE = "Something went wrong. Try again.";

// The message to show for a failed request. The server's own message is shown
// for client errors (4xx). Server errors and network failures get a generic
// one, because their details are not for the user.
export function getFormErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.status < 500) {
    return error.message;
  }
  return GENERIC_ERROR_MESSAGE;
}
