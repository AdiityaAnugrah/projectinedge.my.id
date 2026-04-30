import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { signToken, cookieName } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ error: 'Nama pengguna dan kata sandi wajib diisi' }, { status: 400 });
  }

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, username]
    );
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return NextResponse.json({ error: 'Nama pengguna atau kata sandi salah' }, { status: 401 });
    }
    if (!user.is_verified) {
      return NextResponse.json({ error: 'Email belum diverifikasi. Cek inbox Anda.' }, { status: 403 });
    }
    if (!user.is_active) {
      return NextResponse.json({ error: 'Akun Anda telah dinonaktifkan. Hubungi admin.' }, { status: 403 });
    }

    const token = await signToken({ userId: user.id, username: user.username, role: user.role });
    const res = NextResponse.json({ ok: true, username: user.username, role: user.role });
    res.cookies.set(cookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return res;
  } finally {
    conn.release();
  }
}
