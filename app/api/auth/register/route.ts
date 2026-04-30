import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// Endpoint ini hanya untuk setup awal — setelah ada user pertama, endpoint ini ditutup.
export async function POST(req: NextRequest) {
  const conn = await pool.getConnection();
  try {
    const [existing] = await conn.query<RowDataPacket[]>('SELECT COUNT(*) as c FROM users');
    if (existing[0].c > 0) {
      return NextResponse.json({ error: 'Registrasi sudah ditutup' }, { status: 403 });
    }

    const { username, password } = await req.json();
    if (!username || !password || password.length < 6) {
      return NextResponse.json({ error: 'Nama pengguna wajib diisi, kata sandi minimal 6 karakter' }, { status: 400 });
    }

    const hash = await bcrypt.hash(password, 12);
    await conn.query('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hash]);
    return NextResponse.json({ ok: true, message: `User '${username}' berhasil dibuat` }, { status: 201 });
  } finally {
    conn.release();
  }
}
