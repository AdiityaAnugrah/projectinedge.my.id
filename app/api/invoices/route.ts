import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { buildInvoiceNo } from '@/lib/utils';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function GET() {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT i.*, GROUP_CONCAT(
        JSON_OBJECT('barang', ii.barang, 'qty', ii.qty, 'harga', ii.harga, 'total', ii.total)
        ORDER BY ii.id
      ) AS items_json
      FROM invoices i
      LEFT JOIN invoice_items ii ON ii.invoice_id = i.id
      GROUP BY i.id
      ORDER BY i.created_at DESC`
    );
    const invoices = rows.map((r) => ({
      ...r,
      items: r.items_json ? JSON.parse(`[${r.items_json}]`) : [],
      items_json: undefined,
    }));
    return NextResponse.json(invoices);
  } finally {
    conn.release();
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { customer_name, invoice_date, notes, template, items, status } = body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const monthYear = invoice_date.slice(0, 7);
    await conn.query(
      `INSERT INTO invoice_counters (month_year, counter) VALUES (?, 1)
       ON DUPLICATE KEY UPDATE counter = counter + 1`,
      [monthYear]
    );
    const [counterRows] = await conn.query<RowDataPacket[]>(
      'SELECT counter FROM invoice_counters WHERE month_year = ?',
      [monthYear]
    );
    const counter = counterRows[0].counter as number;

    const [settingRows] = await conn.query<RowDataPacket[]>('SELECT business_code FROM settings WHERE id = 1');
    const code = settingRows[0]?.business_code || 'PRJ';
    const invoiceNo = buildInvoiceNo(counter, code, invoice_date);

    const grandTotal = (items as { qty: number; harga: number }[]).reduce(
      (sum, i) => sum + i.qty * i.harga,
      0
    );

    const [result] = await conn.query<ResultSetHeader>(
      'INSERT INTO invoices (invoice_no, customer_name, invoice_date, notes, grand_total, template, status) VALUES (?,?,?,?,?,?,?)',
      [invoiceNo, customer_name, invoice_date, notes || '', grandTotal, template || 1, status || 'unpaid']
    );
    const invoiceId = result.insertId;

    for (const item of items as { barang: string; qty: number; harga: number }[]) {
      await conn.query(
        'INSERT INTO invoice_items (invoice_id, barang, qty, harga) VALUES (?,?,?,?)',
        [invoiceId, item.barang, item.qty, item.harga]
      );
    }

    await conn.commit();
    return NextResponse.json({ id: invoiceId, invoice_no: invoiceNo }, { status: 201 });
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}
