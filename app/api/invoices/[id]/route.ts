import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/session';
import { RowDataPacket } from 'mysql2';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT i.*, GROUP_CONCAT(
        JSON_OBJECT('barang', ii.barang, 'qty', ii.qty, 'harga', ii.harga, 'total', ii.total)
        ORDER BY ii.id
      ) AS items_json
      FROM invoices i
      LEFT JOIN invoice_items ii ON ii.invoice_id = i.id
      WHERE i.id = ? AND i.user_id = ?
      GROUP BY i.id`,
      [id, session.userId]
    );
    if (!rows.length) return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 });
    const inv = { ...rows[0], items: rows[0].items_json ? JSON.parse(`[${rows[0].items_json}]`) : [], items_json: undefined };
    return NextResponse.json(inv);
  } finally {
    conn.release();
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const conn = await pool.getConnection();
  try {
    if (body.status !== undefined) {
      await conn.query('UPDATE invoices SET status = ? WHERE id = ? AND user_id = ?', [body.status, id, session.userId]);
    }
    return NextResponse.json({ ok: true });
  } finally {
    conn.release();
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const conn = await pool.getConnection();
  try {
    await conn.query('DELETE FROM invoices WHERE id = ? AND user_id = ?', [id, session.userId]);
    return NextResponse.json({ ok: true });
  } finally {
    conn.release();
  }
}
