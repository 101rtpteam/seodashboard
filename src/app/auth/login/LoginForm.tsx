'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/proxy-auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push(params.get('from') || '/overview');
    } else {
      setError('Неверный пароль');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#EDE8FF',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{
        background: 'white', borderRadius: 16, padding: '48px 40px',
        width: 360, boxShadow: '0 4px 32px rgba(157,10,255,0.10)',
      }}>
        <form onSubmit={handleSubmit}>
          <input
            type="password" placeholder="Пароль" value={password}
            onChange={e => setPassword(e.target.value)} autoFocus
            style={{
              width: '100%', padding: '12px 16px', borderRadius: 8,
              border: '1.5px solid #E0D9FF', fontSize: 15, outline: 'none',
              boxSizing: 'border-box', color: '#0D0713', marginBottom: 16,
            }}
          />
          {error && <div style={{ color: '#e53e3e', fontSize: 13, marginBottom: 12 }}>{error}</div>}
          <button type="submit" disabled={loading || !password} style={{
            width: '100%', padding: '12px', background: loading ? '#C084FC' : '#9D0AFF',
            color: 'white', border: 'none', borderRadius: 8, fontSize: 15,
            fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
          }}>
            {loading ? 'Входим...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
}
