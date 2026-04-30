import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/session';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== 'superadmin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const { is_active } = await req.json();
  const conn = await pool.getConnection();
  try {
    await conn.query('UPDATE users SET is_active = ? WHERE id = ? AND role = ?', [is_active, id, 'owner']);
    return NextResponse.json({ ok: true });
  } finally {
    conn.release();
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== 'superadmin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const conn = await pool.getConnection();
  try {
    await conn.query('DELETE FROM users WHERE id = ? AND role = ?', [id, 'owner']);
    return NextResponse.json({ ok: true });
  } finally {
    conn.release();
  }
}
