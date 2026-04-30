import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import pool from '@/lib/db';
import { sendVerificationEmail } from '@/lib/email';
import { RowDataPacket } from 'mysql2';

export async function POST(req: NextRequest) {
  const { username, email, password } = await req.json();

  if (!username || !email || !password) {
    return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'Kata sandi minimal 6 karakter' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Format email tidak valid' }, { status: 400 });
  }

  const conn = await pool.getConnection();
  try {
    const [existing] = await conn.query<RowDataPacket[]>(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Username atau email sudah terdaftar' }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 12);
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 jam

    const [result] = await conn.query<import('mysql2').ResultSetHeader>(
      `INSERT INTO users (username, email, password_hash, role, is_verified, verification_token, verification_expires)
       VALUES (?, ?, ?, 'owner', 0, ?, ?)`,
      [username, email, hash, token, expires]
    );

    // Buat settings default untuk owner baru
    await conn.query(
      'INSERT INTO settings (user_id, business_name, business_code) VALUES (?, ?, ?)',
      [result.insertId, username, 'INV']
    );

    await sendVerificationEmail(email, username, token);

    return NextResponse.json(
      { ok: true, message: 'Pendaftaran berhasil! Cek email Anda untuk verifikasi.' },
      { status: 201 }
    );
  } finally {
    conn.release();
  }
}
