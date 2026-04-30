import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) return NextResponse.json({ error: 'Token tidak valid' }, { status: 400 });

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE verification_token = ? AND verification_expires > NOW()',
      [token]
    );
    if (!rows.length) {
      return NextResponse.json({ error: 'Token tidak valid atau sudah kadaluarsa' }, { status: 400 });
    }

    await conn.query(
      'UPDATE users SET is_verified = 1, verification_token = NULL, verification_expires = NULL WHERE id = ?',
      [rows[0].id]
    );

    return NextResponse.json({ ok: true, message: 'Email berhasil diverifikasi! Silakan login.' });
  } finally {
    conn.release();
  }
}
