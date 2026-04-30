import { cookies } from 'next/headers';
import { verifyToken, cookieName } from './auth';

export async function getSession() {
  const jar = await cookies();
  const token = jar.get(cookieName())?.value;
  if (!token) return null;
  return verifyToken(token);
}
