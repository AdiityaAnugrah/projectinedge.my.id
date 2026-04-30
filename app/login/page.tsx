'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login gagal');
        return;
      }
      router.push('/');
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Kalam', cursive; background: #f5f4f1; }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f4f1', fontFamily: "'Kalam', cursive" }}>
        <div style={{ background: '#fff', borderRadius: '14px', padding: '36px 32px', width: '340px', boxShadow: '0 8px 32px rgba(0,0,0,0.10)', border: '1px solid #eee' }}>

          {/* Logo area */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🧾</div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#222' }}>Pembuat Invoice</h1>
            <p style={{ fontSize: '0.82rem', color: '#999', marginTop: '4px' }}>Masuk untuk melanjutkan</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#555', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Nama Pengguna
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoFocus
                style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none', transition: 'border 0.15s' }}
                onFocus={e => (e.target.style.borderColor = '#e07830')}
                onBlur={e => (e.target.style.borderColor = '#ddd')}
                placeholder="nama pengguna"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#555', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Kata Sandi
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none', transition: 'border 0.15s' }}
                onFocus={e => (e.target.style.borderColor = '#e07830')}
                onBlur={e => (e.target.style.borderColor = '#ddd')}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div style={{ background: '#fff0f0', border: '1px solid #ffcdd2', borderRadius: '7px', padding: '8px 12px', marginBottom: '14px', color: '#c62828', fontSize: '0.83rem' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '10px', background: loading ? '#ccc' : '#e07830', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
            >
              {loading ? 'Masuk...' : 'Masuk →'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
