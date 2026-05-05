import Link from 'next/link';
import LoginPageClient from './LoginPageClient';

export default function LoginPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <main className="glass-panel" style={{ 
        maxWidth: '400px', 
        width: '100%', 
        padding: '3rem 2rem', 
        textAlign: 'center' 
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            Acceso <span className="text-gradient">PIE</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            Escuela Pucara Alto
          </p>
        </div>

        <LoginPageClient />

        <div style={{ marginTop: '2rem', fontSize: '0.875rem' }}>
          <Link href="/" style={{ color: '#60a5fa', textDecoration: 'none' }}>
            &larr; Volver al inicio
          </Link>
        </div>
      </main>
    </div>
  );
}
