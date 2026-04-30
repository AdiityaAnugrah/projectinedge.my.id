import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query<RowDataPacket[]>('SELECT * FROM settings WHERE id = 1');
    return NextResponse.json(rows[0] || { business_name: 'Nama Bisnis', business_code: 'PRJ' });
  } finally {
    conn.release();
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { business_name, business_code, logo_data_url } = body;
  const conn = await pool.getConnection();
  try {
    await conn.query(
      `UPDATE settings SET business_name = ?, business_code = ?, logo_data_url = ? WHERE id = 1`,
      [business_name, business_code, logo_data_url ?? null]
    );
    return NextResponse.json({ ok: true });
  } finally {
    conn.release();
  }
}
