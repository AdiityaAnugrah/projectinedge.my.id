'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', konfirmasi: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (form.password !== form.konfirmasi) {
      setError('Kata sandi dan konfirmasi tidak sama');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setSuccess(data.message);
    } finally {
      setLoading(false);
    }
  }

  const inputSt: React.CSSProperties = { width: '100%', padding: '9px 12px', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' };
  const labelSt: React.CSSProperties = { display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#555', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } body { font-family: 'Kalam', cursive; background: #f5f4f1; }`}</style>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f4f1', fontFamily: "'Kalam', cursive" }}>
        <div style={{ background: '#fff', borderRadius: '14px', padding: '36px 32px', width: '380px', boxShadow: '0 8px 32px rgba(0,0,0,0.10)', border: '1px solid #eee' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '6px' }}>🧾</div>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#222' }}>Daftar Akun</h1>
            <p style={{ fontSize: '0.82rem', color: '#999', marginTop: '4px' }}>Buat akun untuk mulai membuat invoice</p>
          </div>

          {success ? (
            <div style={{ background: '#f0fff4', border: '1px solid #86efac', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📧</div>
              <p style={{ fontWeight: 700, color: '#166534', marginBottom: '6px' }}>Pendaftaran Berhasil!</p>
              <p style={{ fontSize: '0.85rem', color: '#166534' }}>{success}</p>
              <Link href="/login" style={{ display: 'inline-block', marginTop: '14px', color: '#e07830', fontWeight: 700 }}>← Kembali ke Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={labelSt}>Nama Pengguna</label>
                <input value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} required style={inputSt} placeholder="namabisnis" onFocus={e => (e.target.style.borderColor = '#e07830')} onBlur={e => (e.target.style.borderColor = '#ddd')} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={labelSt}>Email</label>
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required style={inputSt} placeholder="email@bisnis.com" onFocus={e => (e.target.style.borderColor = '#e07830')} onBlur={e => (e.target.style.borderColor = '#ddd')} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={labelSt}>Kata Sandi</label>
                <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required minLength={6} style={inputSt} placeholder="min. 6 karakter" onFocus={e => (e.target.style.borderColor = '#e07830')} onBlur={e => (e.target.style.borderColor = '#ddd')} />
              </div>
              <div style={{ marginBottom: '18px' }}>
                <label style={labelSt}>Konfirmasi Kata Sandi</label>
                <input type="password" value={form.konfirmasi} onChange={e => setForm(p => ({ ...p, konfirmasi: e.target.value }))} required style={inputSt} placeholder="ulangi kata sandi" onFocus={e => (e.target.style.borderColor = '#e07830')} onBlur={e => (e.target.style.borderColor = '#ddd')} />
              </div>

              {error && <div style={{ background: '#fff0f0', border: '1px solid #ffcdd2', borderRadius: '7px', padding: '8px 12px', marginBottom: '14px', color: '#c62828', fontSize: '0.83rem' }}>{error}</div>}

              <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', background: loading ? '#ccc' : '#e07830', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
              </button>

              <p style={{ textAlign: 'center', marginTop: '14px', fontSize: '0.85rem', color: '#888' }}>
                Sudah punya akun?{' '}
                <Link href="/login" style={{ color: '#e07830', fontWeight: 700 }}>Masuk</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
