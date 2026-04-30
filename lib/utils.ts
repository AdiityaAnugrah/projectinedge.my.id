export function formatRp(n: number): string {
  return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}

export function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

export function monthYear(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${yyyy}-${mm}`;
}

export function buildInvoiceNo(counter: number, code: string, date: string): string {
  const [yyyy, mm] = date.split('-');
  return `${String(counter).padStart(5, '0')}/INV/${code}/${mm}/${yyyy}`;
}

export interface InvoiceItem {
  barang: string;
  qty: number;
  harga: number;
  total: number;
}

export interface Invoice {
  id?: number;
  invoice_no: string;
  customer_name: string;
  invoice_date: string;
  notes?: string;
  grand_total: number;
  template: number;
  status: 'paid' | 'unpaid';
  items: InvoiceItem[];
  created_at?: string;
}

export interface Settings {
  business_name: string;
  business_code: string;
  logo_data_url?: string;
}
