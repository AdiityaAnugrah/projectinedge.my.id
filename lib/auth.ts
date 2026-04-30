import { SignJWT, jwtVerify } from 'jose';

const COOKIE = 'inv_token';

function secret() {
  return new TextEncoder().encode(process.env.JWT_SECRET!);
}

export async function signToken(payload: { userId: number; username: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(await secret());
}

export async function verifyToken(token: string): Promise<{ userId: number; username: string } | null> {
  try {
    const { payload } = await jwtVerify(token, await secret());
    return payload as { userId: number; username: string };
  } catch {
    return null;
  }
}

export function cookieName() {
  return COOKIE;
}
