export interface JwtClaims { sub: string; email: string; role: string; }

export function decodeJwt(token: string): JwtClaims | null {
  const parts = token.split('.');
  if (parts.length < 2) return null;
  try {
    const json = JSON.parse(atob(parts[1]));
    return { sub: String(json.sub ?? ''), email: String(json.email ?? ''), role: String(json.role ?? '') };
  } catch {
    return null;
  }
}
