'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import InvoiceTemplate from '@/components/InvoiceTemplates';
import HistoryModal from '@/components/HistoryModal';
import TweaksPanel from '@/components/TweaksPanel';
import { Invoice, InvoiceItem, Settings, formatRp, todayStr } from '@/lib/utils';

const TEMPLATE_NAMES = ['Klasik Struk', 'Kotak Minimalis', 'Tajuk Tebal', 'Dua Kolom', 'Stempel/Tulis'];

const emptyItem = (): InvoiceItem => ({ barang: '', qty: 1, harga: 0, total: 0 });

const defaultForm = (): Partial<Invoice> => ({
  customer_name: '',
  invoice_date: todayStr(),
  notes: '',
  items: [emptyItem()],
  status: 'unpaid',
  grand_total: 0,
  template: 1,
});

export default function Home() {
  const [form, setForm] = useState<Partial<Invoice>>(defaultForm());
  const [template, setTemplate] = useState(1);
  const [accentColor, setAccentColor] = useState('#e07830');
  const [showLogo, setShowLogo] = useState(true);
  const [logoSize, setLogoSize] = useState(20);
  const [logoAlign, setLogoAlign] = useState<'left' | 'center' | 'right'>('left');
  const [alamatPos, setAlamatPos] = useState<'header' | 'footer'>('header');
  const [fontFamily, setFontFamily] = useState("'Kalam', cursive");
  const [fontSize, setFontSize] = useState(11);
  const [showHistory, setShowHistory] = useState(false);
  const [showTweaks, setShowTweaks] = useState(false);
  const [history, setHistory] = useState<Invoice[]>([]);
  const [settings, setSettings] = useState<Settings>({ business_name: 'Nama Bisnis', business_code: 'PRJ' });
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const printRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => { if (d.username) { setUsername(d.username); setRole(d.role); } }).catch(() => {});
    fetch('/api/settings').then(r => r.json()).then(setSettings).catch(() => {});
    fetchHistory();
  }, []);

  function fetchHistory() {
    fetch('/api/invoices').then(r => r.json()).then(setHistory).catch(() => {});
  }

  const grandTotal = (form.items || []).reduce((s, i) => s + Number(i.qty) * Number(i.harga), 0);

  function setItem(idx: number, key: keyof InvoiceItem, val: string | number) {
    setForm(prev => {
      const items = [...(prev.items || [])];
      items[idx] = { ...items[idx], [key]: val };
      items[idx].total = Number(items[idx].qty) * Number(items[idx].harga);
      return { ...prev, items };
    });
  }

  function addItem() {
    setForm(prev => ({ ...prev, items: [...(prev.items || []), emptyItem()] }));
  }

  function removeItem(idx: number) {
    setForm(prev => ({ ...prev, items: (prev.items || []).filter((_, i) => i !== idx) }));
  }

  async function handleSave() {
    if (!form.customer_name) return alert('Nama pelanggan wajib diisi');
    if (!(form.items || []).some(i => i.barang)) return alert('Minimal 1 item wajib diisi');
    setSaving(true);
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, template, grand_total: grandTotal }),
      });
      const data = await res.json();
      fetchHistory();
      alert(`Invoice ${data.invoice_no} berhasil disimpan!`);
      setForm(defaultForm());
    } catch {
      alert('Gagal menyimpan invoice');
    } finally {
      setSaving(false);
    }
  }

  function handleWhatsApp() {
    const text = `Invoice ${form.invoice_no || '-'}\nKepada: ${form.customer_name}\nTotal: ${formatRp(grandTotal)}\nTanggal: ${form.invoice_date}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }

  async function handleDelete(id: number) {
    if (!confirm('Hapus invoice ini?')) return;
    await fetch(`/api/invoices/${id}`, { method: 'DELETE' });
    fetchHistory();
  }

  async function handleSaveSettings() {
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    alert('Pengaturan berhasil disimpan!');
  }

  const previewInvoice: Partial<Invoice> = { ...form, grand_total: grandTotal };

  const inputSt: React.CSSProperties = { width: '100%', padding: '6px 9px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.88rem', boxSizing: 'border-box', fontFamily: 'inherit', background: '#fff' };
  const labelSt: React.CSSProperties = { display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#666', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.05em' };
  const btnSt = (bg: string, color = '#fff'): React.CSSProperties => ({ padding: '7px 14px', background: bg, color, border: 'none', borderRadius: '7px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', fontFamily: 'inherit' });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Kalam:wght@400;700&family=JetBrains+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #f5f4f1; font-family: 'Kalam', cursive; }
        @media print {
          @page { size: 105mm 148mm; margin: 0; }
          body > div { display: none !important; }
          #print-area {
            display: block !important;
            position: fixed;
            inset: 0;
            width: 105mm;
            height: 148mm;
          }
          #print-area * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
        #print-area { display: none; }
      `}</style>

      {/* Hidden print target */}
      <div id="print-area">
        <InvoiceTemplate invoice={previewInvoice} settings={settings} template={template} accentColor={accentColor} showLogo={showLogo} fontFamily={fontFamily} fontSize={fontSize} logoSize={logoSize} logoAlign={logoAlign} alamatPos={alamatPos} />
      </div>

      <div style={{ minHeight: '100vh', background: '#f5f4f1', fontFamily: "'Kalam', cursive" }}>
        {/* Header */}
        <header style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.4rem' }}>🧾</span>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#222' }}>Pembuat Invoice</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {username && <span style={{ fontSize: '0.8rem', color: '#888', fontFamily: 'sans-serif' }}>👤 {username}</span>}
            {role === 'superadmin' && (
              <button onClick={() => router.push('/admin')} style={btnSt('#1a1a1a')}>🛡 Admin</button>
            )}
            <button onClick={() => { setShowHistory(true); fetchHistory(); }} style={btnSt('#f0f0f0', '#333')}>📋 Riwayat</button>
            <button onClick={() => setShowTweaks(p => !p)} style={btnSt(showTweaks ? accentColor : '#f0f0f0', showTweaks ? '#fff' : '#333')}>⚙ Pengaturan</button>
            <button onClick={handleLogout} style={btnSt('#fff0ee', '#c0392b')}>🚪 Keluar</button>
          </div>
        </header>

        {/* Main layout */}
        <div style={{ display: 'flex', height: 'calc(100vh - 57px)' }}>

          {/* ── Left: Form ── */}
          <div style={{ width: '320px', minWidth: '280px', overflowY: 'auto', padding: '16px', borderRight: '1px solid #e8e8e8', background: '#fff' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '0.85rem', color: '#333', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Form Invoice</h3>

            <div style={{ marginBottom: '10px' }}>
              <span style={labelSt}>Nama Pelanggan *</span>
              <input value={form.customer_name || ''} onChange={e => setForm(p => ({ ...p, customer_name: e.target.value }))} style={inputSt} placeholder="Nama pelanggan" />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <span style={labelSt}>Tanggal</span>
              <input type="date" value={form.invoice_date || todayStr()} onChange={e => setForm(p => ({ ...p, invoice_date: e.target.value }))} style={inputSt} />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <span style={labelSt}>Status</span>
              <select value={form.status || 'unpaid'} onChange={e => setForm(p => ({ ...p, status: e.target.value as 'paid' | 'unpaid' }))} style={inputSt}>
                <option value="unpaid">Belum Lunas</option>
                <option value="paid">Lunas</option>
              </select>
            </div>

            {/* Items */}
            <div style={{ marginBottom: '10px' }}>
              <span style={labelSt}>Item</span>
              {(form.items || []).map((item, idx) => (
                <div key={idx} style={{ border: '1px solid #eee', borderRadius: '7px', padding: '8px', marginBottom: '6px', background: '#fafafa' }}>
                  <input value={item.barang} onChange={e => setItem(idx, 'barang', e.target.value)} style={{ ...inputSt, marginBottom: '5px', background: '#fff' }} placeholder="Nama barang / jasa" />
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <div style={{ flex: '0 0 62px' }}>
                      <span style={{ ...labelSt, fontSize: '0.65rem' }}>Qty</span>
                      <input type="number" min={1} value={item.qty} onChange={e => setItem(idx, 'qty', Number(e.target.value))} style={{ ...inputSt, textAlign: 'center', background: '#fff', padding: '5px 4px' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ ...labelSt, fontSize: '0.65rem' }}>Harga (Rp)</span>
                      <input type="number" min={0} value={item.harga || ''} onChange={e => setItem(idx, 'harga', Number(e.target.value))} style={{ ...inputSt, background: '#fff' }} placeholder="0" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ ...labelSt, fontSize: '0.65rem' }}>Total</span>
                      <input readOnly value={formatRp(Number(item.qty) * Number(item.harga))} style={{ ...inputSt, background: '#f0f0f0', color: '#555', fontSize: '0.8rem' }} />
                    </div>
                  </div>
                  {(form.items || []).length > 1 && (
                    <button onClick={() => removeItem(idx)} style={{ marginTop: '4px', background: 'none', border: 'none', color: '#f44336', cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'inherit' }}>✕ Hapus item</button>
                  )}
                </div>
              ))}
              <button onClick={addItem} style={{ ...btnSt('#f0f0f0', '#333'), width: '100%', marginTop: '2px' }}>+ Tambah Item</button>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <span style={labelSt}>Catatan (opsional)</span>
              <textarea value={form.notes || ''} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} style={{ ...inputSt, height: '60px', resize: 'vertical' } as React.CSSProperties} placeholder="Catatan tambahan..." />
            </div>

            {/* Grand Total */}
            <div style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}55`, borderRadius: '8px', padding: '8px 12px', marginBottom: '14px', textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', color: '#666' }}>Total Keseluruhan: </span>
              <span style={{ fontWeight: 700, fontSize: '1.1rem', color: accentColor }}>{formatRp(grandTotal)}</span>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              <button onClick={handleSave} disabled={saving} style={{ ...btnSt(accentColor), opacity: saving ? 0.7 : 1, width: '100%' }}>
                {saving ? 'Menyimpan...' : '💾 Simpan Invoice'}
              </button>
              <div style={{ display: 'flex', gap: '7px' }}>
                <button onClick={() => window.print()} style={{ ...btnSt('#333'), flex: 1 }}>🖨️ Cetak / PDF</button>
                <button onClick={handleWhatsApp} style={{ ...btnSt('#25D366'), flex: 1 }}>💬 WA</button>
              </div>
              <div style={{ background: '#fffbe6', border: '1px solid #ffe082', borderRadius: '7px', padding: '8px 10px', fontSize: '0.75rem', color: '#7a5c00', lineHeight: '1.6' }}>
                <b>⚙ Pengaturan cetak yang benar:</b>
                <ol style={{ margin: '4px 0 0 14px', padding: 0 }}>
                  <li>Ukuran kertas → <b>A6</b> <span style={{ color: '#aaa' }}>(atau biarkan, sudah otomatis)</span></li>
                  <li>Margin → <b>Tanpa Margin</b> (None)</li>
                  <li>Skala → <b>100%</b> (jangan Fit to page)</li>
                  <li>Untuk PDF → pilih <b>Simpan sebagai PDF</b></li>
                </ol>
              </div>
            </div>
          </div>

          {/* ── Center: Preview ── */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', background: '#f5f4f1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Template tabs */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {TEMPLATE_NAMES.map((name, i) => (
                <button key={i} onClick={() => setTemplate(i + 1)}
                  style={{ padding: '5px 11px', border: `1.5px solid ${template === i + 1 ? accentColor : '#ccc'}`, background: template === i + 1 ? accentColor : '#fff', color: template === i + 1 ? '#fff' : '#555', borderRadius: '20px', cursor: 'pointer', fontSize: '0.76rem', fontWeight: 700, fontFamily: 'inherit' }}>
                  {String(i + 1).padStart(2, '0')} {name}
                </button>
              ))}
            </div>

            {/* Paper preview */}
            <div style={{ background: '#bbb', padding: '2px', borderRadius: '3px', boxShadow: '0 6px 24px rgba(0,0,0,0.22)' }}>
              <div ref={printRef}>
                <InvoiceTemplate
                  invoice={previewInvoice}
                  settings={settings}
                  template={template}
                  accentColor={accentColor}
                  showLogo={showLogo}
                  fontFamily={fontFamily}
                  fontSize={fontSize}
                  logoSize={logoSize}
                  logoAlign={logoAlign}
                  alamatPos={alamatPos}
                />
              </div>
            </div>

            <p style={{ marginTop: '10px', fontSize: '0.73rem', color: '#999', fontFamily: 'sans-serif' }}>
              Pratinjau langsung · Cetak → Simpan sebagai PDF · ukuran A6 (105×148mm)
            </p>
          </div>

          {/* ── Right: Tweaks ── */}
          {showTweaks && (
            <TweaksPanel
              template={template} setTemplate={setTemplate}
              showLogo={showLogo} setShowLogo={setShowLogo}
              logoSize={logoSize} setLogoSize={setLogoSize}
              logoAlign={logoAlign} setLogoAlign={setLogoAlign}
              alamatPos={alamatPos} setAlamatPos={setAlamatPos}
              fontFamily={fontFamily} setFontFamily={setFontFamily}
              fontSize={fontSize} setFontSize={setFontSize}
              accentColor={accentColor} setAccentColor={setAccentColor}
              settings={settings} setSettings={setSettings}
              onLogoUpload={url => setSettings(p => ({ ...p, logo_data_url: url }))}
              onSaveSettings={handleSaveSettings}
            />
          )}
        </div>
      </div>

      {showHistory && (
        <HistoryModal
          invoices={history}
          onLoad={inv => { setForm(inv); setTemplate(inv.template || 1); setShowHistory(false); }}
          onDelete={handleDelete}
          onClose={() => setShowHistory(false)}
        />
      )}
    </>
  );
}
