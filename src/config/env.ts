/**
 * Базовый URL API NestJS с префиксом v1, например: http://localhost:3000/v1
 * Задаётся в .env как EXPO_PUBLIC_API_URL (см. .env.example).
 *
 * На Android-эмуляторе вместо localhost часто нужен http://10.0.2.2:3000/v1.
 * С реального телефона — IP вашего ПК в локальной сети.
 */
const fromEnv = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');

/** В development без .env удобно ходить на локальный faiza-api (iOS Simulator). Для Android-эмулятора задайте EXPO_PUBLIC_API_URL=http://10.0.2.2:3000/v1 */
export const API_BASE_URL =
  fromEnv ??
  (typeof __DEV__ !== 'undefined' && __DEV__ ? 'http://localhost:3000/v1' : '');

export function isApiConfigured(): boolean {
  return API_BASE_URL.length > 0;
}
