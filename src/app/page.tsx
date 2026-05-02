import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <main className="glass-panel" style={{ 
        maxWidth: '800px', 
        width: '100%', 
        padding: '4rem 3rem', 
        textAlign: 'center' 
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <span style={{ 
            display: 'inline-block',
            padding: '4px 12px', 
            borderRadius: '20px', 
            background: 'rgba(59, 130, 246, 0.1)',
            color: '#60a5fa',
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            Escuela Pucara Alto - Equipo PIE
          </span>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>
            Plataforma <span className="text-gradient">Educativa</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Gestiona de forma simple y hermosa el material de aprendizaje. Un espacio conectado entre profesionales, apoderados y alumnos, sin barreras tecnológicas.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '3rem', flexWrap: 'wrap' }}>
          <Link href="/login" className="glass-button primary" style={{ minWidth: '220px' }}>
            Acceso Profesionales
          </Link>
          <Link href="/portal/demo-token" className="glass-button" style={{ minWidth: '220px' }}>
            Portal del Alumno
          </Link>
        </div>
      </main>

      <footer style={{ marginTop: '4rem', color: '#64748b', fontSize: '0.875rem' }}>
        © {new Date().getFullYear()} Plataforma PIE Escuela Pucara Alto. Diseñado por Baúl de Josefa SPA.
      </footer>
    </div>
  );
}
