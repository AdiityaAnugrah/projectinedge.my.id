'use client';
import { Invoice, formatRp } from '@/lib/utils';

interface Props {
  invoices: Invoice[];
  onLoad: (inv: Invoice) => void;
  onDelete: (id: number) => void;
  onClose: () => void;
}

export default function HistoryModal({ invoices, onLoad, onDelete, onClose }: Props) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: '10px', width: '480px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Riwayat Invoice</h2>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#666' }}>✕</button>
        </div>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {invoices.length === 0 && <p style={{ padding: '20px', color: '#999', textAlign: 'center' }}>Belum ada invoice tersimpan.</p>}
          {invoices.map((inv) => (
            <div key={inv.id} style={{ padding: '12px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{inv.invoice_no}</div>
                <div style={{ fontSize: '0.8rem', color: '#555' }}>{inv.customer_name} · {inv.invoice_date}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#333' }}>{formatRp(inv.grand_total)}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => { onLoad(inv); onClose(); }}
                  style={{ padding: '4px 10px', border: '1px solid #4CAF50', background: '#fff', color: '#4CAF50', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
                  Buka
                </button>
                <button onClick={() => onDelete(inv.id!)}
                  style={{ padding: '4px 10px', border: '1px solid #f44336', background: '#fff', color: '#f44336', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
