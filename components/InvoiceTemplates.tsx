'use client';
import { Invoice, Settings, formatRp } from '@/lib/utils';

interface Props {
  invoice: Partial<Invoice>;
  settings: Settings;
  template: number;
  accentColor: string;
  showLogo: boolean;
  fontFamily: string;
  fontSize: number;
  logoSize?: number;
  logoAlign?: 'left' | 'center' | 'right';
  alamatPos?: 'header' | 'footer';
}

function ItemsTable({ items, accentColor }: { items: Invoice['items']; accentColor: string }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'inherit' }}>
      <thead>
        <tr style={{ borderBottom: `1px solid ${accentColor}` }}>
          <th style={{ textAlign: 'left', padding: '2px 0', fontSize: '0.8em', textTransform: 'uppercase' }}>Barang</th>
          <th style={{ textAlign: 'center', padding: '2px 4px', fontSize: '0.8em', textTransform: 'uppercase' }}>Jml</th>
          <th style={{ textAlign: 'right', padding: '2px 0', fontSize: '0.8em', textTransform: 'uppercase' }}>Harga</th>
          <th style={{ textAlign: 'right', padding: '2px 0', fontSize: '0.8em', textTransform: 'uppercase' }}>Total</th>
        </tr>
      </thead>
      <tbody>
        {(items || []).map((item, i) => (
          <tr key={i}>
            <td style={{ padding: '3px 0' }}>{item.barang || '-'}</td>
            <td style={{ textAlign: 'center', padding: '3px 4px' }}>{item.qty}</td>
            <td style={{ textAlign: 'right', padding: '3px 0', whiteSpace: 'nowrap' }}>{formatRp(item.harga)}</td>
            <td style={{ textAlign: 'right', padding: '3px 0', whiteSpace: 'nowrap' }}>{formatRp(item.total ?? item.qty * item.harga)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

interface BusinessBlockProps {
  settings: Settings;
  showLogo: boolean;
  logoSize: number;
  logoAlign: 'left' | 'center' | 'right';
  showAlamat: boolean;
  logoFilter?: string;
  nameColor?: string;
  infoColor?: string;
}

function ContactLines({ settings, textAlign, color }: { settings: Settings; textAlign: 'left' | 'center' | 'right'; color: string }) {
  return (
    <div style={{ fontSize: '0.72em', color, textAlign, lineHeight: 1.4, marginTop: '2px' }}>
      {settings.alamat && <div>{settings.alamat}</div>}
      {settings.telepon && <div>Telp: {settings.telepon}</div>}
      {settings.whatsapp && <div>WA: {settings.whatsapp}</div>}
      {settings.email_bisnis && <div>{settings.email_bisnis}</div>}
      {settings.instagram && <div>IG: {settings.instagram}</div>}
      {settings.facebook && <div>FB: {settings.facebook}</div>}
      {settings.twitter && <div>X: {settings.twitter}</div>}
      {settings.tiktok && <div>TikTok: {settings.tiktok}</div>}
      {settings.youtube && <div>YT: {settings.youtube}</div>}
      {settings.linkedin && <div>LinkedIn: {settings.linkedin}</div>}
      {settings.website && <div>{settings.website}</div>}
    </div>
  );
}

function hasAnyContact(s: Settings) {
  return s.alamat || s.telepon || s.whatsapp || s.email_bisnis || s.instagram || s.facebook || s.twitter || s.tiktok || s.youtube || s.linkedin || s.website;
}

function BusinessBlock({ settings, showLogo, logoSize, logoAlign, showAlamat, logoFilter, nameColor = '#1a1a1a', infoColor = '#666' }: BusinessBlockProps) {
  const align = logoAlign === 'center' ? 'center' : logoAlign === 'right' ? 'flex-end' : 'flex-start';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: align }}>
      {showLogo && settings.logo_data_url && (
        <img src={settings.logo_data_url} alt="logo" style={{ height: `${logoSize}px`, marginBottom: '2px', filter: logoFilter }} />
      )}
      <div style={{ fontWeight: 700, fontSize: '1.1em', color: nameColor, textAlign: logoAlign }}>{settings.business_name}</div>
      {showAlamat && hasAnyContact(settings) && (
        <ContactLines settings={settings} textAlign={logoAlign} color={infoColor} />
      )}
    </div>
  );
}

function AlamatFooter({ settings, accentColor }: { settings: Settings; accentColor: string }) {
  if (!hasAnyContact(settings)) return null;
  return (
    <div style={{ borderTop: `1px dashed ${accentColor}`, marginTop: '8px', paddingTop: '5px' }}>
      <ContactLines settings={settings} textAlign="left" color="#666" />
    </div>
  );
}

const dashed = '- - - - - - - - - - - - - - - - - - - - - - - - -';

// Template 01: Klasik Struk
function T01({ invoice, settings, accentColor, showLogo, fontSize, logoSize = 20, logoAlign = 'center', alamatPos = 'header' }: Omit<Props, 'template'>) {
  const base: React.CSSProperties = { fontFamily: `'JetBrains Mono', monospace`, fontSize: `${fontSize}px`, color: '#1a1a1a', padding: '8mm', boxSizing: 'border-box', width: '105mm', minHeight: '148mm', background: '#fff' };
  return (
    <div style={base}>
      <div style={{ marginBottom: '4px' }}>
        <BusinessBlock settings={settings} showLogo={showLogo} logoSize={logoSize} logoAlign={logoAlign} showAlamat={alamatPos === 'header'} />
      </div>
      <div style={{ textAlign: 'center', fontSize: '0.75em', color: '#666', marginBottom: '6px' }}>{dashed}</div>
      <div style={{ fontSize: '0.85em', marginBottom: '2px' }}>No: <b>{invoice.invoice_no || '—'}</b></div>
      <div style={{ fontSize: '0.85em', marginBottom: '2px' }}>Tgl: {invoice.invoice_date || '—'}</div>
      <div style={{ fontSize: '0.85em', marginBottom: '6px' }}>Kepada: <b>{invoice.customer_name || '—'}</b></div>
      <div style={{ textAlign: 'center', fontSize: '0.75em', color: '#666', marginBottom: '6px' }}>{dashed}</div>
      <ItemsTable items={invoice.items || []} accentColor={accentColor} />
      <div style={{ textAlign: 'center', fontSize: '0.75em', color: '#666', margin: '6px 0' }}>{dashed}</div>
      <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '1em' }}>TOTAL: {formatRp(invoice.grand_total || 0)}</div>
      {invoice.notes && <div style={{ marginTop: '6px', fontSize: '0.8em', color: '#555' }}>Catatan: {invoice.notes}</div>}
      {alamatPos === 'footer' && <AlamatFooter settings={settings} accentColor={accentColor} />}
      <div style={{ textAlign: 'center', fontSize: '0.75em', color: '#666', margin: '6px 0' }}>{dashed}</div>
      <div style={{ textAlign: 'center', fontSize: '0.8em' }}>Terima kasih!</div>
    </div>
  );
}

// Template 02: Minimal Box
function T02({ invoice, settings, accentColor, showLogo, fontFamily, fontSize, logoSize = 20, logoAlign = 'left', alamatPos = 'header' }: Omit<Props, 'template'>) {
  const base: React.CSSProperties = { fontFamily, fontSize: `${fontSize}px`, color: '#1a1a1a', padding: '8mm', boxSizing: 'border-box', width: '105mm', minHeight: '148mm', background: '#fff', border: `1px solid #ddd` };
  const lbl: React.CSSProperties = { fontSize: '0.7em', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888' };
  return (
    <div style={base}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <BusinessBlock settings={settings} showLogo={showLogo} logoSize={logoSize} logoAlign={logoAlign} showAlamat={alamatPos === 'header'} />
        <div style={{ textAlign: 'right' }}>
          <div style={lbl}>No. Invoice</div>
          <div style={{ fontWeight: 600, fontSize: '0.85em' }}>{invoice.invoice_no || '—'}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '8px', padding: '6px', background: '#f8f8f8', borderRadius: '4px' }}>
        <div>
          <div style={lbl}>Kepada</div>
          <div style={{ fontWeight: 600 }}>{invoice.customer_name || '—'}</div>
        </div>
        <div>
          <div style={lbl}>Tanggal</div>
          <div>{invoice.invoice_date || '—'}</div>
        </div>
      </div>
      <ItemsTable items={invoice.items || []} accentColor={accentColor} />
      <div style={{ marginTop: '8px', borderTop: `2px solid ${accentColor}`, paddingTop: '6px', textAlign: 'right' }}>
        <span style={lbl}>Total Keseluruhan </span>
        <span style={{ fontWeight: 700, fontSize: '1.1em' }}>{formatRp(invoice.grand_total || 0)}</span>
      </div>
      {invoice.notes && <div style={{ marginTop: '6px', fontSize: '0.8em', color: '#555', padding: '4px', border: '1px dashed #ccc', borderRadius: '4px' }}>{invoice.notes}</div>}
      {alamatPos === 'footer' && <AlamatFooter settings={settings} accentColor={accentColor} />}
      <div style={{ marginTop: 'auto', paddingTop: '8px', fontSize: '0.75em', color: '#999', textAlign: 'center' }}>Terima kasih atas kepercayaan Anda</div>
    </div>
  );
}

// Template 03: Bold Header
function T03({ invoice, settings, accentColor, showLogo, fontFamily, fontSize, logoSize = 20, logoAlign = 'left', alamatPos = 'header' }: Omit<Props, 'template'>) {
  const base: React.CSSProperties = { fontFamily, fontSize: `${fontSize}px`, color: '#1a1a1a', boxSizing: 'border-box', width: '105mm', minHeight: '148mm', background: '#fff', overflow: 'hidden' };
  return (
    <div style={base}>
      <div style={{ background: accentColor, color: '#fff', padding: '8mm 8mm 6mm', marginBottom: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <BusinessBlock settings={settings} showLogo={showLogo} logoSize={logoSize} logoAlign={logoAlign} showAlamat={alamatPos === 'header'} logoFilter="brightness(10)" nameColor="#fff" infoColor="rgba(255,255,255,0.8)" />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7em', opacity: 0.8 }}>FAKTUR</div>
            <div style={{ fontWeight: 700, fontSize: '0.9em' }}>{invoice.invoice_no || '—'}</div>
          </div>
        </div>
      </div>
      <div style={{ padding: '0 8mm 8mm' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
          <div>
            <div style={{ fontSize: '0.7em', color: '#888', textTransform: 'uppercase' }}>Kepada</div>
            <div style={{ fontWeight: 600 }}>{invoice.customer_name || '—'}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.7em', color: '#888', textTransform: 'uppercase' }}>Tanggal</div>
            <div>{invoice.invoice_date || '—'}</div>
          </div>
        </div>
        <ItemsTable items={invoice.items || []} accentColor={accentColor} />
        <div style={{ marginTop: '8px', background: `${accentColor}15`, borderRadius: '4px', padding: '6px', textAlign: 'right' }}>
          <span style={{ fontSize: '0.8em', color: '#666' }}>JUMLAH </span>
          <span style={{ fontWeight: 700, fontSize: '1.2em', color: accentColor }}>{formatRp(invoice.grand_total || 0)}</span>
        </div>
        {invoice.notes && <div style={{ marginTop: '6px', fontSize: '0.8em', color: '#555' }}>{invoice.notes}</div>}
        {alamatPos === 'footer' && <AlamatFooter settings={settings} accentColor={accentColor} />}
        <div style={{ marginTop: '8px', fontSize: '0.75em', color: '#999', textAlign: 'center' }}>Terima kasih!</div>
      </div>
    </div>
  );
}

// Template 04: Two-Column
function T04({ invoice, settings, accentColor, showLogo, fontFamily, fontSize, logoSize = 20, logoAlign = 'left', alamatPos = 'header' }: Omit<Props, 'template'>) {
  const base: React.CSSProperties = { fontFamily, fontSize: `${fontSize}px`, color: '#1a1a1a', padding: '8mm', boxSizing: 'border-box', width: '105mm', minHeight: '148mm', background: '#fff' };
  const col: React.CSSProperties = { flex: 1 };
  const lbl: React.CSSProperties = { fontSize: '0.7em', textTransform: 'uppercase', color: '#888', marginBottom: '1px' };
  return (
    <div style={base}>
      <div style={{ borderBottom: `2px solid ${accentColor}`, paddingBottom: '6px', marginBottom: '8px' }}>
        <BusinessBlock settings={settings} showLogo={showLogo} logoSize={logoSize} logoAlign={logoAlign} showAlamat={alamatPos === 'header'} />
      </div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <div style={col}>
          <div style={lbl}>Kepada</div>
          <div style={{ fontWeight: 600 }}>{invoice.customer_name || '—'}</div>
        </div>
        <div style={col}>
          <div style={lbl}>No. Invoice</div>
          <div style={{ fontWeight: 600, fontSize: '0.85em' }}>{invoice.invoice_no || '—'}</div>
          <div style={{ ...lbl, marginTop: '4px' }}>Tanggal</div>
          <div>{invoice.invoice_date || '—'}</div>
        </div>
      </div>
      <ItemsTable items={invoice.items || []} accentColor={accentColor} />
      <div style={{ marginTop: '8px', borderTop: `1px solid #ddd`, paddingTop: '6px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontWeight: 700, color: accentColor, fontSize: '1.1em' }}>{formatRp(invoice.grand_total || 0)}</span>
      </div>
      {invoice.notes && <div style={{ marginTop: '6px', fontSize: '0.8em', color: '#555' }}>{invoice.notes}</div>}
      {alamatPos === 'footer' && <AlamatFooter settings={settings} accentColor={accentColor} />}
      <div style={{ marginTop: '10px', borderTop: '1px dashed #ccc', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '0.75em', color: '#999' }}>
        <span>Terima kasih</span>
        <span>___________</span>
      </div>
    </div>
  );
}

// Template 05: Stamp / Hand
function T05({ invoice, settings, accentColor, showLogo, fontSize, logoSize = 20, logoAlign = 'left', alamatPos = 'header' }: Omit<Props, 'template'>) {
  const base: React.CSSProperties = { fontFamily: `'Caveat', cursive`, fontSize: `${fontSize + 1}px`, color: '#1a1a1a', padding: '8mm', boxSizing: 'border-box', width: '105mm', minHeight: '148mm', background: '#fffef8', border: '2px solid #333', borderRadius: '4px 6px 5px 3px / 3px 5px 6px 4px' };
  const stampStyle: React.CSSProperties = {
    display: 'inline-block', border: `3px solid ${accentColor}`, color: accentColor, padding: '2px 8px', fontWeight: 700, fontSize: '1em', textTransform: 'uppercase', letterSpacing: '2px', transform: 'rotate(-8deg)', opacity: 0.8, borderRadius: '3px'
  };
  const isPaid = invoice.status === 'paid';
  return (
    <div style={base}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <BusinessBlock settings={settings} showLogo={showLogo} logoSize={logoSize} logoAlign={logoAlign} showAlamat={alamatPos === 'header'} />
        <div style={stampStyle}>{isPaid ? 'LUNAS' : 'BELUM LUNAS'}</div>
      </div>
      <div style={{ borderBottom: '1px dashed #666', marginBottom: '6px', paddingBottom: '4px' }}>
        <div>No: <b>{invoice.invoice_no || '—'}</b></div>
        <div>Tgl: {invoice.invoice_date || '—'}</div>
        <div>Kepada: <b>{invoice.customer_name || '—'}</b></div>
      </div>
      <ItemsTable items={invoice.items || []} accentColor={accentColor} />
      <div style={{ borderTop: '1px dashed #666', marginTop: '6px', paddingTop: '4px', textAlign: 'right' }}>
        <b style={{ fontSize: '1.1em' }}>Total: {formatRp(invoice.grand_total || 0)}</b>
      </div>
      {invoice.notes && <div style={{ marginTop: '6px', fontSize: '0.85em', color: '#555', fontStyle: 'italic' }}>*{invoice.notes}</div>}
      {alamatPos === 'footer' && <AlamatFooter settings={settings} accentColor={accentColor} />}
      <div style={{ marginTop: '10px', fontSize: '0.9em', color: '#666', textAlign: 'center' }}>~ Terima kasih ~</div>
    </div>
  );
}

const TEMPLATES = [T01, T02, T03, T04, T05];

export default function InvoiceTemplate(props: Props) {
  const T = TEMPLATES[(props.template - 1) % 5];
  return <T {...props} />;
}
