'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, formatRp } from '@/lib/utils';

interface Owner extends User {
  business_name: string;
  business_code: string;
  total_invoices: number;
}

export default function AdminPage() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => { fetchOwners(); }, []);

  function fetchOwners() {
    setLoading(true);
    fetch('/api/admin/owners').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setOwners(data);
    }).finally(() => setLoading(false));
  }

  async function toggleActive(id: number, current: number) {
    await fetch(`/api/admin/owners/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: current ? 0 : 1 }),
    });
    fetchOwners();
  }

  async function handleDelete(id: number, username: string) {
    if (!confirm(`Hapus akun "${username}" beserta semua datanya? Tindakan ini tidak bisa dibatalkan.`)) return;
    await fetch(`/api/admin/owners/${id}`, { method: 'DELETE' });
    fetchOwners();
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  const filtered = owners.filter(o =>
    o.username.toLowerCase().includes(search.toLowerCase()) ||
    o.email.toLowerCase().includes(search.toLowerCase()) ||
    (o.business_name || '').toLowerCase().includes(search.toLowerCase())
  );

  const badge = (v: number, yes: string, no: string, yesColor: string, noColor: string) => (
    <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700, background: v ? yesColor + '22' : noColor + '22', color: v ? yesColor : noColor }}>
      {v ? yes : no}
    </span>
  );

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } body { font-family: 'Kalam', cursive; background: #f5f4f1; }`}</style>
      <div style={{ minHeight: '100vh', background: '#f5f4f1', fontFamily: "'Kalam', cursive" }}>

        {/* Header */}
        <header style={{ background: '#1a1a1a', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.3rem' }}>🧾</span>
            <span style={{ color: '#fff', fontWeight: 700 }}>Panel Admin</span>
            <span style={{ background: '#e07830', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>SUPERADMIN</span>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button onClick={() => router.push('/')} style={{ padding: '6px 14px', background: '#333', color: '#fff', border: 'none', borderRadius: '7px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: '0.85rem' }}>
              🧾 Buka Invoice
            </button>
            <button onClick={handleLogout} style={{ padding: '6px 14px', background: '#fff0ee', color: '#c0392b', border: 'none', borderRadius: '7px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: '0.85rem' }}>
              🚪 Keluar
            </button>
          </div>
        </header>

        <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {[
              { label: 'Total Owner', value: owners.length, icon: '👥' },
              { label: 'Terverifikasi', value: owners.filter(o => o.is_verified).length, icon: '✅' },
              { label: 'Aktif', value: owners.filter(o => o.is_active).length, icon: '🟢' },
              { label: 'Total Invoice', value: owners.reduce((s, o) => s + Number(o.total_invoices), 0), icon: '🧾' },
            ].map(s => (
              <div key={s.label} style={{ background: '#fff', borderRadius: '10px', padding: '16px 20px', flex: '1', minWidth: '130px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', border: '1px solid #eee' }}>
                <div style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{s.icon}</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#222' }}>{s.value}</div>
                <div style={{ fontSize: '0.78rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Search & Table */}
          <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', border: '1px solid #eee', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#222' }}>Daftar Owner ({filtered.length})</h2>
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Cari nama, email, bisnis..."
                style={{ padding: '7px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'inherit', width: '220px' }}
              />
            </div>

            {loading ? (
              <p style={{ padding: '24px', textAlign: 'center', color: '#999' }}>Memuat...</p>
            ) : filtered.length === 0 ? (
              <p style={{ padding: '24px', textAlign: 'center', color: '#999' }}>Belum ada owner terdaftar.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#f8f8f8' }}>
                      {['Username', 'Email', 'Bisnis', 'Invoice', 'Verifikasi', 'Status', 'Tgl Daftar', 'Aksi'].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: '#555', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(o => (
                      <tr key={o.id} style={{ borderTop: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 600 }}>@{o.username}</td>
                        <td style={{ padding: '10px 14px', color: '#555' }}>{o.email}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <div style={{ fontWeight: 600 }}>{o.business_name || '-'}</div>
                          <div style={{ fontSize: '0.75rem', color: '#999' }}>{o.business_code}</div>
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700 }}>{o.total_invoices}</td>
                        <td style={{ padding: '10px 14px' }}>{badge(o.is_verified, 'Terverifikasi', 'Belum', '#16a34a', '#dc2626')}</td>
                        <td style={{ padding: '10px 14px' }}>{badge(o.is_active, 'Aktif', 'Nonaktif', '#2563eb', '#9ca3af')}</td>
                        <td style={{ padding: '10px 14px', color: '#888', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                          {new Date(o.created_at).toLocaleDateString('id-ID')}
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => toggleActive(o.id, o.is_active)}
                              style={{ padding: '4px 10px', border: `1px solid ${o.is_active ? '#9ca3af' : '#2563eb'}`, background: '#fff', color: o.is_active ? '#9ca3af' : '#2563eb', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                              {o.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                            </button>
                            <button onClick={() => handleDelete(o.id, o.username)}
                              style={{ padding: '4px 10px', border: '1px solid #f44336', background: '#fff', color: '#f44336', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'inherit' }}>
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
