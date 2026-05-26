import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Eye, Palette, Compass, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="app-container">
      {/* Navbar */}
      <header className="navbar">
        <div className="logo-container">
          <Palette className="logo-icon" size={28} />
          <span className="logo-text">Lucy Tejada</span>
        </div>
        <nav className="nav-links">
          <a href="#inicio" className="nav-link active">Inicio</a>
          <a href="#programas" className="nav-link">Programas</a>
          <a href="#nosotros" className="nav-link">Nosotros</a>
        </nav>
        <div className="nav-actions">
          {user ? (
            <Link 
              to={
                user.rol === 'ADMIN' 
                  ? '/admin' 
                  : user.rol === 'EDUCADOR' 
                    ? '/profesor' 
                    : '/estudiante'
              } 
              className="btn btn-primary"
            >
              Ir a mi panel
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">
                <LogIn size={16} />
                Ingresar
              </Link>
              <Link to="/register" className="btn btn-accent">
                <UserPlus size={16} />
                Registrarse
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="hero-section">
        <div className="hero-bg-glow"></div>
        <div className="hero-content-left">
          <h1 className="hero-title">Explora tu creatividad sin límites</h1>
          <p className="hero-description">
            Bienvenido al Centro Cultural Lucy Tejada. Un espacio vibrante dedicado a la formación artística, la danza, la música y las artes plásticas. Comienza tu viaje hoy mismo.
          </p>
          <div className="hero-ctas">
            <Link to="/register" className="btn btn-primary btn-lg">
              Comenzar Ahora
              <ArrowRight size={18} />
            </Link>
            <a href="#programas" className="btn btn-secondary btn-lg">
              Explorar Programas
            </a>
          </div>
        </div>
        <div className="hero-image-container">
          <div className="hero-image-glass">
            <div className="hero-art-glow"></div>
            <div className="hero-art-placeholder">
              <Compass size={80} className="logo-icon" />
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.25rem' }}>Espacio Creativo</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Música • Danza • Teatro • Plásticas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programas Section */}
      <section id="programas" className="section" style={{ background: 'var(--bg-secondary)', borderTop: 'var(--glass-border)' }}>
        <div className="section-title-container">
          <span className="section-tag">Formación Cultural</span>
          <h2 className="section-title">Nuestras Escuelas de Arte</h2>
        </div>
        <div className="cards-grid">
          <div className="card">
            <div className="card-icon">
              <Music size={24} />
            </div>
            <h3 className="card-title">Música</h3>
            <p className="card-desc">
              Aprende teoría musical, solfeo e instrumentos como guitarra, piano, violín y viento con profesores altamente experimentados.
            </p>
          </div>
          <div className="card">
            <div className="card-icon">
              <Eye size={24} />
            </div>
            <h3 className="card-title">Danza y Teatro</h3>
            <p className="card-desc">
              Explora la expresión corporal mediante la danza folclórica, el ballet y la actuación escénica en nuestro gran auditorio.
            </p>
          </div>
          <div className="card">
            <div className="card-icon">
              <Palette size={24} />
            </div>
            <h3 className="card-title">Artes Plásticas</h3>
            <p className="card-desc">
              Domina las técnicas de pintura al óleo, acuarela, dibujo anatómico, escultura y cerámica creativa en talleres equipados.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Centro Cultural Lucy Tejada. Todos los derechos reservados.</p>
        <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>Desarrollado para Ingeniería de Software III</p>
      </footer>
    </div>
  );
};
