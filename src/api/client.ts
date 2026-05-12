import { API_BASE_URL } from '../config/env';

/** Полный URL для пути относительно `/v1`, например `menu/categories` → `{base}/menu/categories` */
export function apiUrl(path: string): string {
  const base = API_BASE_URL;
  if (!base) {
    throw new Error(
      'EXPO_PUBLIC_API_URL не задан. Скопируйте .env.example в .env и укажите URL API (например http://localhost:3000/v1).',
    );
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}

export type ApiFetchOptions = RequestInit & {
  /** Если передан — добавляется заголовок Authorization: Bearer … */
  accessToken?: string | null;
  /** По умолчанию true: выставить Content-Type: application/json, если тело есть и заголовок не задан */
  jsonBody?: boolean;
};

/**
 * fetch к faiza-api: JSON по умолчанию, опционально Bearer.
 * Пример: `apiFetch('menu/dishes', { accessToken })` или `apiFetch('auth/login', { method: 'POST', body: JSON.stringify({...}) })`
 */
export async function apiFetch(path: string, options: ApiFetchOptions = {}): Promise<Response> {
  const { accessToken, jsonBody = true, headers: initHeaders, body, ...rest } = options;
  const headers = new Headers(initHeaders);

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  if (
    jsonBody &&
    body !== undefined &&
    typeof body === 'string' &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(apiUrl(path), {
    ...rest,
    body,
    headers,
  });
}
