'use client';

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
  businessName: string;
  setBusinessName: (v: string) => void;
  businessCode: string;
  setBusinessCode: (v: string) => void;
  onLogoUpload: (dataUrl: string) => void;
  onSaveSettings: () => void;
}

const FONTS = [
  { label: 'Kalam', value: "'Kalam', cursive" },
  { label: 'Caveat', value: "'Caveat', cursive" },
  { label: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
  { label: 'Mono', value: "'JetBrains Mono', monospace" },
];

export default function TweaksPanel(props: Props) {
  const row: React.CSSProperties = { marginBottom: '10px' };
  const label: React.CSSProperties = { display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#555', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.04em' };
  const input: React.CSSProperties = { width: '100%', padding: '5px 8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.85rem', boxSizing: 'border-box' };

  function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => props.onLogoUpload(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div style={{ padding: '12px 14px', background: '#fafafa', borderLeft: '1px solid #eee', minWidth: '180px' }}>
      <div style={{ fontWeight: 700, fontSize: '0.8rem', marginBottom: '12px', color: '#333', textTransform: 'uppercase', letterSpacing: '0.05em' }}>⚙ Pengaturan</div>

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

      <div style={row}>
        <label style={label}>
          <input type="checkbox" checked={props.showLogo} onChange={e => props.setShowLogo(e.target.checked)} style={{ marginRight: '6px' }} />
          Tampilkan Logo
        </label>
        <input type="file" accept="image/*" onChange={handleLogo} style={{ fontSize: '0.75rem', marginTop: '4px' }} />
      </div>

      <div style={row}>
        <span style={label}>Jenis Huruf</span>
        <select value={props.fontFamily} onChange={e => props.setFontFamily(e.target.value)} style={input}>
          {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
      </div>

      <div style={row}>
        <span style={label}>Ukuran Font ({props.fontSize}px)</span>
        <input type="range" min={9} max={14} value={props.fontSize} onChange={e => props.setFontSize(Number(e.target.value))} style={{ width: '100%' }} />
      </div>

      <div style={row}>
        <span style={label}>Warna Aksen</span>
        <input type="color" value={props.accentColor} onChange={e => props.setAccentColor(e.target.value)} style={{ width: '100%', height: '30px', border: '1px solid #ddd', borderRadius: '5px', padding: '2px' }} />
      </div>

      <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', marginTop: '4px' }}>
        <div style={{ fontWeight: 700, fontSize: '0.75rem', marginBottom: '8px', color: '#333', textTransform: 'uppercase' }}>Info Bisnis</div>
        <div style={row}>
          <span style={label}>Nama Bisnis</span>
          <input value={props.businessName} onChange={e => props.setBusinessName(e.target.value)} style={input} />
        </div>
        <div style={row}>
          <span style={label}>Kode Bisnis</span>
          <input value={props.businessCode} onChange={e => props.setBusinessCode(e.target.value)} style={{ ...input, textTransform: 'uppercase' }} maxLength={6} />
        </div>
        <button onClick={props.onSaveSettings}
          style={{ width: '100%', padding: '6px', background: '#333', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
          Simpan Pengaturan
        </button>
      </div>
    </div>
  );
}
