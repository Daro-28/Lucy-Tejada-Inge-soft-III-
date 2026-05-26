import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiGet } from '../api';
import type { ProfesorDashboardData } from '../api';
import {
  Palette, Users, ClipboardList, CheckSquare, Bell,
  Home, BookOpen, LogOut
} from 'lucide-react';

export const ProfesorDashboard: React.FC = () => {
  const { user, token, logout } = useAuth();
  const [data, setData] = useState<ProfesorDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    apiGet<ProfesorDashboardData>('/dashboard/profesor', token)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [token]);

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
            <li><a href="#grupos" className="sidebar-link"><Users size={18} />Mis Grupos</a></li>
            <li><a href="#asistencias" className="sidebar-link"><ClipboardList size={18} />Asistencias</a></li>
            <li><a href="#calificaciones" className="sidebar-link"><CheckSquare size={18} />Evaluaciones</a></li>
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Panel del Docente</h2>
          <div className="user-profile-badge">
            <div className="user-avatar">{user?.nombre.charAt(0).toUpperCase()}</div>
            <div className="profile-text">
              <span>{user?.nombre}</span>
              <small>Educador</small>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="welcome-banner profesor-banner">
            <div className="welcome-banner-glow profesor-glow"></div>
            <h1 className="welcome-title">¡Saludos, Prof. {user?.nombre}!</h1>
            <p className="welcome-subtitle">Tus grupos, estudiantes, asistencias y evaluaciones se cargan desde la base de datos.</p>
          </div>

          {error && <div className="alert alert-danger dashboard-alert">{error}</div>}

          <div className="dashboard-stats">
            <Stat icon={<Users size={20} />} label="Grupos Asignados" value={data?.stats.grupos ?? '...'} />
            <Stat icon={<Users size={20} />} label="Estudiantes Activos" value={data?.stats.estudiantesActivos ?? '...'} />
            <Stat icon={<ClipboardList size={20} />} label="Asistencias Registradas" value={data?.stats.asistenciasRegistradas ?? '...'} />
            <Stat icon={<CheckSquare size={20} />} label="Evaluaciones" value={data?.stats.evaluaciones ?? '...'} />
          </div>

          <div className="dashboard-grid">
            <section id="grupos" className="dashboard-section">
              <div className="section-header">
                <h3 className="section-heading">Mis Grupos de Formación</h3>
                <BookOpen size={18} />
              </div>
              <div className="data-list">
                {data?.grupos.map((grupo) => (
                  <div className="data-row" key={grupo.id}>
                    <div>
                      <strong>{grupo.nombre}</strong>
                      <span>{grupo.programa?.nombre ?? 'Sin programa'} · {grupo.horario ?? 'Sin horario'} · {grupo.matriculas?.length ?? 0}/{grupo.cupoMaximo} estudiantes</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="dashboard-section">
              <div className="section-header">
                <h3 className="section-heading">Alertas</h3>
                <Bell size={18} />
              </div>
              <div className="data-list">
                {data?.notificaciones.map((notificacion) => (
                  <div className="data-row compact-row" key={notificacion.id}>
                    <div>
                      <strong>{new Date(notificacion.fecha).toLocaleDateString()}</strong>
                      <span>{notificacion.mensaje}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="dashboard-grid dashboard-grid-wide">
            <section id="asistencias" className="dashboard-section">
              <div className="section-header">
                <h3 className="section-heading">Últimas Asistencias</h3>
              </div>
              <div className="data-list">
                {data?.asistencias.slice(0, 8).map((asistencia) => (
                  <div className="data-row" key={asistencia.id}>
                    <div>
                      <strong>{asistencia.estudiante?.usuario?.nombre ?? 'Estudiante'}</strong>
                      <span>{asistencia.grupo?.nombre} · {new Date(asistencia.fecha).toLocaleDateString()}</span>
                    </div>
                    <span className="status-pill">{asistencia.presente ? 'Presente' : 'Ausente'}</span>
                  </div>
                ))}
              </div>
            </section>

            <section id="calificaciones" className="dashboard-section">
              <div className="section-header">
                <h3 className="section-heading">Evaluaciones</h3>
              </div>
              <div className="data-list">
                {data?.evaluaciones.map((evaluacion) => (
                  <div className="data-row" key={evaluacion.id}>
                    <div>
                      <strong>{evaluacion.estudiante?.usuario?.nombre ?? 'Estudiante'}</strong>
                      <span>{evaluacion.descripcion ?? evaluacion.grupo?.nombre}</span>
                    </div>
                    <span className="status-pill">{evaluacion.calificacion ?? 'Sin nota'}</span>
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

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="stat-card">
      <div className="stat-icon-wrapper">{icon}</div>
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
      </div>
    </div>
  );
}
