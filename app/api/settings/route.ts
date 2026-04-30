import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/session';
import { RowDataPacket } from 'mysql2';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      'SELECT * FROM settings WHERE user_id = ?',
      [session.userId]
    );
    return NextResponse.json(rows[0] || { business_name: 'Nama Bisnis', business_code: 'INV' });
  } finally {
    conn.release();
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const {
    business_name, business_code, logo_data_url,
    alamat, telepon, email_bisnis, whatsapp,
    instagram, facebook, twitter, tiktok, youtube, linkedin, website,
  } = body;

  const conn = await pool.getConnection();
  try {
    await conn.query(
      `INSERT INTO settings (user_id, business_name, business_code, logo_data_url, alamat, telepon, email_bisnis, whatsapp, instagram, facebook, twitter, tiktok, youtube, linkedin, website)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         business_name = VALUES(business_name),
         business_code = VALUES(business_code),
         logo_data_url = VALUES(logo_data_url),
         alamat = VALUES(alamat),
         telepon = VALUES(telepon),
         email_bisnis = VALUES(email_bisnis),
         whatsapp = VALUES(whatsapp),
         instagram = VALUES(instagram),
         facebook = VALUES(facebook),
         twitter = VALUES(twitter),
         tiktok = VALUES(tiktok),
         youtube = VALUES(youtube),
         linkedin = VALUES(linkedin),
         website = VALUES(website)`,
      [session.userId, business_name, business_code, logo_data_url ?? null,
       alamat ?? null, telepon ?? null, email_bisnis ?? null, whatsapp ?? null,
       instagram ?? null, facebook ?? null, twitter ?? null, tiktok ?? null,
       youtube ?? null, linkedin ?? null, website ?? null]
    );
    return NextResponse.json({ ok: true });
  } finally {
    conn.release();
  }
}
