import Link from 'next/link';

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

        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>
              Correo Electrónico
            </label>
            <input 
              type="email" 
              className="glass-input" 
              placeholder="profesional@pucaraalto.cl"
              required 
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>
              Contraseña
            </label>
            <input 
              type="password" 
              className="glass-input" 
              placeholder="••••••••"
              required 
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            {/* For now this will link to dashboard as a mock login */}
            <Link href="/dashboard" className="glass-button primary" style={{ width: '100%', display: 'block', textAlign: 'center', boxSizing: 'border-box' }}>
              Ingresar a la Plataforma
            </Link>
          </div>
        </form>

        <div style={{ marginTop: '2rem', fontSize: '0.875rem' }}>
          <Link href="/" style={{ color: '#60a5fa', textDecoration: 'none' }}>
            &larr; Volver al inicio
          </Link>
        </div>
      </main>
    </div>
  );
}
