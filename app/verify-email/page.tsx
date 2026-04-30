'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function VerifyContent() {
  const params = useSearchParams();
  const token = params.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) { setStatus('error'); setMessage('Token tidak ditemukan'); return; }
    fetch(`/api/auth/verify?token=${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.ok) { setStatus('success'); setMessage(data.message); }
        else { setStatus('error'); setMessage(data.error); }
      })
      .catch(() => { setStatus('error'); setMessage('Terjadi kesalahan'); });
  }, [token]);

  return (
    <div style={{ background: '#fff', borderRadius: '14px', padding: '40px 32px', width: '360px', boxShadow: '0 8px 32px rgba(0,0,0,0.10)', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '12px' }}>
        {status === 'loading' ? '⏳' : status === 'success' ? '✅' : '❌'}
      </div>
      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#222', marginBottom: '10px' }}>
        {status === 'loading' ? 'Memverifikasi...' : status === 'success' ? 'Email Terverifikasi!' : 'Verifikasi Gagal'}
      </h2>
      <p style={{ fontSize: '0.88rem', color: '#666', marginBottom: '20px' }}>{message}</p>
      {status !== 'loading' && (
        <Link href="/login" style={{ display: 'inline-block', padding: '10px 24px', background: '#e07830', color: '#fff', borderRadius: '8px', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
          {status === 'success' ? 'Masuk Sekarang →' : 'Kembali ke Login'}
        </Link>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } body { font-family: 'Kalam', cursive; background: #f5f4f1; }`}</style>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f4f1', fontFamily: "'Kalam', cursive" }}>
        <Suspense fallback={<div>Memuat...</div>}>
          <VerifyContent />
        </Suspense>
      </div>
    </>
  );
}
