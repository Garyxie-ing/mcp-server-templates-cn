/**
 * API key auth helper.
 *
 * Rules (kept deliberately simple):
 * - If the API_KEY environment variable is set (non-empty), every request
 *   must carry the same value in the `x-api-key` header, otherwise it is
 *   rejected with 401.
 * - If API_KEY is not set, auth is disabled (local development only) and a
 *   warning is printed once at startup. Never run without a key in
 *   production.
 */
export function isAuthorized(
  headers: Record<string, string | string[] | undefined>,
  expectedKey: string | undefined,
): boolean {
  if (!expectedKey) {
    return true;
  }
  const provided = headers["x-api-key"];
  const value = Array.isArray(provided) ? provided[0] : provided;
  return value === expectedKey;
}
