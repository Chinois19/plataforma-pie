'use client';

import { useState } from 'react';
import Link from 'next/link';
import { loginAction } from '@/app/actions/auth';

export default function LoginPageClient() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await loginAction(formData);
    if (result?.error) {
      setError(result.error);
    }
    setLoading(false);
  }

  return (
    <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
      {error && (
        <div style={{ padding: '0.75rem', backgroundColor: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.3)', color: '#fca5a5', borderRadius: '8px', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}
      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>
          Correo Electrónico
        </label>
        <input 
          name="correo"
          type="email" 
          className="glass-input" 
          placeholder="admin@pucaraalto.cl"
          required 
        />
      </div>
      
      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>
          Contraseña
        </label>
        <input 
          name="password"
          type="password" 
          className="glass-input" 
          placeholder="••••••••"
          required 
        />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button type="submit" disabled={loading} className="glass-button primary" style={{ width: '100%', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Ingresando...' : 'Ingresar a la Plataforma'}
        </button>
      </div>
    </form>
  );
}
