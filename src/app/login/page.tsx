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
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Marca de agua del logo en el recuadro */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.08, zIndex: 0, pointerEvents: 'none' }}>
          <img src="/logo.jpg" alt="" style={{ height: '220px', filter: 'grayscale(100%)', opacity: 0.5 }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
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
        </div>
      </main>
    </div>
  );
}
