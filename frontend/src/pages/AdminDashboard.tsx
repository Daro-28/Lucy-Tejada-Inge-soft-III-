import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiGet } from '../api';
import type { AdminDashboardData } from '../api';
import {
  Palette, Users, BookOpen, Calendar, FileText, Bell,
  Home, LogOut, Layers
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, token, logout } = useAuth();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    apiGet<AdminDashboardData>('/dashboard/admin', token)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [token]);

  const stats = data?.stats;

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div>
          <div className="sidebar-brand">
            <Palette className="logo-icon" size={24} />
            <span className="logo-text" style={{ fontSize: '1.2rem' }}>Lucy Tejada</span>
          </div>
          <ul className="sidebar-menu">
            <li><a href="#dashboard" className="sidebar-link active"><Home size={18} />Inicio</a></li>
            <li><a href="#usuarios" className="sidebar-link"><Users size={18} />Usuarios</a></li>
            <li><a href="#programas" className="sidebar-link"><BookOpen size={18} />Programas</a></li>
            <li><a href="#matriculas" className="sidebar-link"><Layers size={18} />Matrículas</a></li>
            <li><a href="#escenarios" className="sidebar-link"><Calendar size={18} />Escenarios</a></li>
            <li><a href="#reportes" className="sidebar-link"><FileText size={18} />Reportes</a></li>
          </ul>
        </div>
        <div className="sidebar-footer">
          <button onClick={logout} className="btn btn-secondary logout-button">
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Panel de Administración</h2>
          <div className="user-profile-badge">
            <div className="user-avatar admin-avatar">{user?.nombre.charAt(0).toUpperCase()}</div>
            <div className="profile-text">
              <span>{user?.nombre}</span>
              <small>Administrador</small>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="welcome-banner admin-banner">
            <div className="welcome-banner-glow admin-glow"></div>
            <h1 className="welcome-title">Bienvenido, Admin {user?.nombre}</h1>
            <p className="welcome-subtitle">Panel conectado a usuarios, programas, matrículas, escenarios y reservas reales del sistema.</p>
          </div>

          {error && <div className="alert alert-danger dashboard-alert">{error}</div>}

          <div className="dashboard-stats">
            <Stat icon={<Users size={20} />} label="Total Usuarios" value={stats?.usuarios ?? '...'} color="#f59e0b" />
            <Stat icon={<BookOpen size={20} />} label="Programas" value={stats?.programas ?? '...'} color="var(--primary)" />
            <Stat icon={<Layers size={20} />} label="Matrículas Activas" value={stats?.matriculasActivas ?? '...'} color="var(--success)" />
            <Stat icon={<Calendar size={20} />} label="Reservas" value={stats?.reservas ?? '...'} color="var(--accent)" />
          </div>

          <div className="dashboard-grid">
            <section id="usuarios" className="dashboard-section">
              <div className="section-header">
                <h3 className="section-heading">Usuarios Registrados</h3>
                <span className="section-count">{data?.usuarios.length ?? 0}</span>
              </div>
              <div className="data-list">
                {data?.usuarios.map((usuario) => (
                  <div className="data-row" key={usuario.id}>
                    <div>
                      <strong>{usuario.nombre}</strong>
                      <span>{usuario.email}</span>
                    </div>
                    <span className="status-pill">{usuario.rol}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="dashboard-section">
              <div className="section-header">
                <h3 className="section-heading">Notificaciones</h3>
                <Bell size={18} />
              </div>
              <div className="data-list">
                {data?.notificaciones.map((notificacion) => (
                  <div className="data-row compact-row" key={notificacion.id}>
                    <div>
                      <strong>{notificacion.usuario?.nombre ?? 'Sistema'}</strong>
                      <span>{notificacion.mensaje}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="dashboard-grid dashboard-grid-wide">
            <section id="programas" className="dashboard-section">
              <div className="section-header">
                <h3 className="section-heading">Programas y Grupos</h3>
              </div>
              <div className="data-list">
                {data?.grupos.map((grupo) => (
                  <div className="data-row" key={grupo.id}>
                    <div>
                      <strong>{grupo.nombre}</strong>
                      <span>{grupo.programa?.nombre ?? 'Sin programa'} · {grupo.horario ?? 'Sin horario'} · {grupo.matriculas?.length ?? 0}/{grupo.cupoMaximo} inscritos</span>
                    </div>
                    <span className="status-pill">{grupo.educador?.usuario?.nombre ?? 'Sin educador'}</span>
                  </div>
                ))}
              </div>
            </section>

            <section id="escenarios" className="dashboard-section">
              <div className="section-header">
                <h3 className="section-heading">Escenarios</h3>
              </div>
              <div className="data-list">
                {data?.escenarios.map((escenario) => (
                  <div className="data-row" key={escenario.id}>
                    <div>
                      <strong>{escenario.nombre}</strong>
                      <span>Capacidad {escenario.capacidad} · {escenario.reservas?.length ?? 0} reservas</span>
                    </div>
                    <span className="status-pill">{escenario.estado}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

function Stat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: React.ReactNode; color: string }) {
  return (
    <div className="stat-card">
      <div className="stat-icon-wrapper" style={{ color, background: 'rgba(255,255,255,0.05)' }}>{icon}</div>
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
      </div>
    </div>
  );
}
