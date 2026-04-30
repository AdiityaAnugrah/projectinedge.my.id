import { SignJWT, jwtVerify } from 'jose';

const COOKIE = 'inv_token';

function secret() {
  return new TextEncoder().encode(process.env.JWT_SECRET!);
}

export interface SessionPayload {
  userId: number;
  username: string;
  role: 'superadmin' | 'owner';
}

export async function signToken(payload: SessionPayload) {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(await secret());
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, await secret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export function cookieName() {
  return COOKIE;
}
