import { get, post } from "../backendRaw";

export interface User {
  id: number;
  email: string;
  name: string;
}

// Plain type aliases (not interfaces) so they can be passed as a request body.
export type LoginInput = { email: string; password: string };
export type RegisterInput = { name: string; email: string; password: string };

interface UserResponse {
  user: User;
}

// GET /api/me. Rejects with a 401 ApiError when nobody is signed in.
export async function fetchCurrentUser(): Promise<User> {
  const response = await get<UserResponse>("/me");
  return response.user;
}

export async function loginRequest(input: LoginInput): Promise<User> {
  const response = await post<UserResponse>("/login", input);
  return response.user;
}

export async function registerRequest(input: RegisterInput): Promise<User> {
  const response = await post<UserResponse>("/register", input);
  return response.user;
}

export async function logoutRequest(): Promise<void> {
  await post<null>("/logout");
}
