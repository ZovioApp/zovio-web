import { env } from './env';

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export async function api<T = unknown>(
  method: Method,
  path: string,
  body?: unknown,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const res = await fetch(`${env.apiUrl}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const payload = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      (payload as { message?: string }).message ?? `Request failed (${res.status})`;
    throw new ApiError(res.status, message);
  }

  return payload as T;
}
