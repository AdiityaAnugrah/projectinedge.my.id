'use client';
import { Settings } from '@/lib/utils';

interface Props {
  template: number;
  setTemplate: (n: number) => void;
  showLogo: boolean;
  setShowLogo: (v: boolean) => void;
  fontFamily: string;
  setFontFamily: (v: string) => void;
  fontSize: number;
  setFontSize: (v: number) => void;
  accentColor: string;
  setAccentColor: (v: string) => void;
  settings: Settings;
  setSettings: (s: Settings) => void;
  onLogoUpload: (dataUrl: string) => void;
  onSaveSettings: () => void;
}

const FONTS = [
  { label: 'Kalam', value: "'Kalam', cursive" },
  { label: 'Caveat', value: "'Caveat', cursive" },
  { label: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
  { label: 'Mono', value: "'JetBrains Mono', monospace" },
];

const SOSMED = [
  { key: 'whatsapp', label: 'WhatsApp', placeholder: '08xxxxxxxxxx' },
  { key: 'instagram', label: 'Instagram', placeholder: '@akun' },
  { key: 'facebook', label: 'Facebook', placeholder: 'nama atau URL' },
  { key: 'twitter', label: 'Twitter/X', placeholder: '@akun' },
  { key: 'tiktok', label: 'TikTok', placeholder: '@akun' },
  { key: 'youtube', label: 'YouTube', placeholder: 'nama channel' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'nama atau URL' },
  { key: 'website', label: 'Website', placeholder: 'https://...' },
] as const;

export default function TweaksPanel(props: Props) {
  const { settings, setSettings } = props;
  const row: React.CSSProperties = { marginBottom: '10px' };
  const label: React.CSSProperties = { display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#555', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.04em' };
  const input: React.CSSProperties = { width: '100%', padding: '5px 8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.82rem', boxSizing: 'border-box', fontFamily: 'inherit' };
  const section: React.CSSProperties = { borderTop: '1px solid #eee', paddingTop: '10px', marginTop: '6px' };
  const sectionTitle: React.CSSProperties = { fontWeight: 700, fontSize: '0.72rem', marginBottom: '8px', color: '#333', textTransform: 'uppercase', letterSpacing: '0.05em' };

  function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => props.onLogoUpload(reader.result as string);
    reader.readAsDataURL(file);
  }

  function set(key: keyof Settings, value: string) {
    setSettings({ ...settings, [key]: value });
  }

  return (
    <div style={{ padding: '12px 14px', background: '#fafafa', borderLeft: '1px solid #eee', width: '210px', overflowY: 'auto', height: '100%' }}>
      <div style={{ fontWeight: 700, fontSize: '0.8rem', marginBottom: '12px', color: '#333', textTransform: 'uppercase', letterSpacing: '0.05em' }}>⚙ Pengaturan</div>

      {/* Template */}
      <div style={row}>
        <span style={label}>Template</span>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => props.setTemplate(n)}
              style={{ padding: '3px 7px', border: `1px solid ${props.template === n ? '#e07830' : '#ddd'}`, background: props.template === n ? '#e07830' : '#fff', color: props.template === n ? '#fff' : '#333', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
              {String(n).padStart(2, '0')}
            </button>
          ))}
        </div>
      </div>

      {/* Logo */}
      <div style={row}>
        <label style={label}>
          <input type="checkbox" checked={props.showLogo} onChange={e => props.setShowLogo(e.target.checked)} style={{ marginRight: '6px' }} />
          Tampilkan Logo
        </label>
        <input type="file" accept="image/*" onChange={handleLogo} style={{ fontSize: '0.72rem', marginTop: '4px', width: '100%' }} />
      </div>

      {/* Tampilan */}
      <div style={row}>
        <span style={label}>Jenis Huruf</span>
        <select value={props.fontFamily} onChange={e => props.setFontFamily(e.target.value)} style={input}>
          {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
      </div>
      <div style={row}>
        <span style={label}>Ukuran Huruf ({props.fontSize}px)</span>
        <input type="range" min={9} max={14} value={props.fontSize} onChange={e => props.setFontSize(Number(e.target.value))} style={{ width: '100%' }} />
      </div>
      <div style={row}>
        <span style={label}>Warna Aksen</span>
        <input type="color" value={props.accentColor} onChange={e => props.setAccentColor(e.target.value)} style={{ width: '100%', height: '30px', border: '1px solid #ddd', borderRadius: '5px', padding: '2px' }} />
      </div>

      {/* Info Bisnis */}
      <div style={section}>
        <div style={sectionTitle}>Info Bisnis</div>
        <div style={row}>
          <span style={label}>Nama Bisnis</span>
          <input value={settings.business_name} onChange={e => set('business_name', e.target.value)} style={input} />
        </div>
        <div style={row}>
          <span style={label}>Kode Invoice</span>
          <input value={settings.business_code} onChange={e => set('business_code', e.target.value.toUpperCase())} style={input} maxLength={6} />
        </div>
        <div style={row}>
          <span style={label}>Alamat</span>
          <textarea value={settings.alamat || ''} onChange={e => set('alamat', e.target.value)} style={{ ...input, height: '52px', resize: 'vertical' } as React.CSSProperties} placeholder="Jl. ..." />
        </div>
        <div style={row}>
          <span style={label}>No. Telepon</span>
          <input value={settings.telepon || ''} onChange={e => set('telepon', e.target.value)} style={input} placeholder="08xx..." />
        </div>
        <div style={row}>
          <span style={label}>Email Bisnis</span>
          <input type="email" value={settings.email_bisnis || ''} onChange={e => set('email_bisnis', e.target.value)} style={input} placeholder="email@bisnis.com" />
        </div>
      </div>

      {/* Sosial Media */}
      <div style={section}>
        <div style={sectionTitle}>Sosial Media</div>
        {SOSMED.map(s => (
          <div key={s.key} style={row}>
            <span style={label}>{s.label}</span>
            <input
              value={(settings as unknown as Record<string, string | undefined>)[s.key] || ''}
              onChange={e => set(s.key as keyof Settings, e.target.value)}
              style={input}
              placeholder={s.placeholder}
            />
          </div>
        ))}
      </div>

      <button onClick={props.onSaveSettings}
        style={{ width: '100%', padding: '8px', background: '#333', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'inherit', fontWeight: 700, marginTop: '4px' }}>
        💾 Simpan Pengaturan
      </button>
    </div>
  );
}
