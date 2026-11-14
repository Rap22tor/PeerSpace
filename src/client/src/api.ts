// The typed get/post/put/patch/del helpers, the query string builder and the
// error class are adapted from BackendRaw.ts, a fetch wrapper from an earlier
// personal project (credited in the README).

type QueryParameter = string | number | boolean;
type QueryParameters = Record<
  string,
  QueryParameter | QueryParameter[] | undefined
>;
type RequestBody = Record<string, unknown>;

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    // Restore the prototype chain so `instanceof ApiError` works after transpiling.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

function getErrorMessage(body: unknown): string {
  if (
    typeof body === "object" &&
    body !== null &&
    "error" in body &&
    typeof body.error === "string"
  ) {
    return body.error;
  }
  return "Something went wrong";
}

function buildQueryString(params: QueryParameters): string {
  const queryParameters = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) {
      continue;
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        queryParameters.append(key, String(item));
      }
    } else {
      queryParameters.append(key, String(value));
    }
  }

  const query = queryParameters.toString();
  return query === "" ? "" : `?${query}`;
}

async function request<T>(
  method: string,
  path: string,
  body?: RequestBody,
): Promise<T> {
  const init: RequestInit = {
    method,
    credentials: "same-origin", // send the session cookie
    redirect: "error", // an API call must never be redirected
  };
  if (body !== undefined) {
    init.headers = { "Content-Type": "application/json; charset=utf-8" };
    init.body = JSON.stringify(body);
  }

  const res = await fetch(`/api${path}`, init);

  const contentType = res.headers.get("Content-Type");
  const isJson = contentType?.startsWith("application/json") === true;
  const data: unknown = isJson
    ? await res.json().catch(() => {
        return null;
      })
    : null;

  if (!res.ok) {
    throw new ApiError(res.status, getErrorMessage(data));
  }
  return data as T;
}

export function get<T>(path: string, query: QueryParameters = {}): Promise<T> {
  return request<T>("GET", `${path}${buildQueryString(query)}`);
}

export function post<T>(path: string, body?: RequestBody): Promise<T> {
  return request<T>("POST", path, body);
}

export function put<T>(path: string, body?: RequestBody): Promise<T> {
  return request<T>("PUT", path, body);
}

export function patch<T>(path: string, body?: RequestBody): Promise<T> {
  return request<T>("PATCH", path, body);
}

// `delete` is a reserved word, hence `del`.
export function del<T>(path: string): Promise<T> {
  return request<T>("DELETE", path);
}
