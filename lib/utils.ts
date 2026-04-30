export function formatRp(n: number): string {
  return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}

export function todayStr(): string {
  return new Date().toISOString().split('T')[0];
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
  user_id?: number;
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
  user_id?: number;
  business_name: string;
  business_code: string;
  logo_data_url?: string;
  alamat?: string;
  telepon?: string;
  email_bisnis?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tiktok?: string;
  youtube?: string;
  linkedin?: string;
  website?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'superadmin' | 'owner';
  is_verified: number;
  is_active: number;
  created_at: string;
}
