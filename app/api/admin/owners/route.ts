import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/session';
import { RowDataPacket } from 'mysql2';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'superadmin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT u.id, u.username, u.email, u.role, u.is_verified, u.is_active, u.created_at,
              s.business_name, s.business_code,
              COUNT(i.id) AS total_invoices
       FROM users u
       LEFT JOIN settings s ON s.user_id = u.id
       LEFT JOIN invoices i ON i.user_id = u.id
       WHERE u.role = 'owner'
       GROUP BY u.id
       ORDER BY u.created_at DESC`
    );
    return NextResponse.json(rows);
  } finally {
    conn.release();
  }
}
