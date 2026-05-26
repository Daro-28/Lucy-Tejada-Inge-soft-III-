import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiGet } from '../api';
import type { EstudianteDashboardData } from '../api';
import {
  Palette, BookOpen, Clock, Award, Bell,
  Home, BookMarked, Calendar, CheckSquare, LogOut
} from 'lucide-react';

export const EstudianteDashboard: React.FC = () => {
  const { user, token, logout } = useAuth();
  const [data, setData] = useState<EstudianteDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    apiGet<EstudianteDashboardData>('/dashboard/estudiante', token)
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
            <li><a href="#matriculas" className="sidebar-link"><BookMarked size={18} />Mis Matrículas</a></li>
            <li><a href="#asistencias" className="sidebar-link"><Calendar size={18} />Mis Asistencias</a></li>
            <li><a href="#calificaciones" className="sidebar-link"><CheckSquare size={18} />Mis Notas</a></li>
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Panel del Estudiante</h2>
          <div className="user-profile-badge">
            <div className="user-avatar">{user?.nombre.charAt(0).toUpperCase()}</div>
            <div className="profile-text">
              <span>{user?.nombre}</span>
              <small>Estudiante</small>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="welcome-banner">
            <div className="welcome-banner-glow"></div>
            <h1 className="welcome-title">¡Hola de nuevo, {user?.nombre}!</h1>
            <p className="welcome-subtitle">Aquí ves tus matrículas, asistencias, notas y notificaciones cargadas desde la base de datos.</p>
          </div>

          {error && <div className="alert alert-danger dashboard-alert">{error}</div>}

          <div className="dashboard-stats">
            <Stat icon={<BookOpen size={20} />} label="Cursos Inscritos" value={data?.stats.cursosInscritos ?? '...'} />
            <Stat icon={<Clock size={20} />} label="Asistencia Promedio" value={data ? `${data.stats.asistenciaPromedio}%` : '...'} />
            <Stat icon={<Award size={20} />} label="Nota Promedio" value={data ? `${data.stats.notaPromedio} / 5.0` : '...'} />
            <Stat icon={<Bell size={20} />} label="Notificaciones" value={data?.stats.notificaciones ?? '...'} />
          </div>

          <div className="dashboard-grid">
            <section id="matriculas" className="dashboard-section">
              <div className="section-header">
                <h3 className="section-heading">Mis Cursos Activos</h3>
              </div>
              <div className="data-list">
                {data?.matriculas.map((matricula) => (
                  <div className="data-row" key={matricula.id}>
                    <div>
                      <strong>{matricula.grupo?.nombre ?? 'Grupo'}</strong>
                      <span>{matricula.grupo?.programa?.nombre ?? 'Programa'} · {matricula.grupo?.horario ?? 'Sin horario'} · Prof. {matricula.grupo?.educador?.usuario?.nombre ?? 'Por asignar'}</span>
                    </div>
                    <span className="status-pill">{matricula.estado}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="dashboard-section">
              <div className="section-header">
                <h3 className="section-heading">Notificaciones</h3>
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
                <h3 className="section-heading">Mis Asistencias</h3>
              </div>
              <div className="data-list">
                {data?.asistencias.slice(0, 8).map((asistencia) => (
                  <div className="data-row" key={asistencia.id}>
                    <div>
                      <strong>{asistencia.grupo?.nombre ?? 'Grupo'}</strong>
                      <span>{new Date(asistencia.fecha).toLocaleDateString()}</span>
                    </div>
                    <span className="status-pill">{asistencia.presente ? 'Presente' : 'Ausente'}</span>
                  </div>
                ))}
              </div>
            </section>

            <section id="calificaciones" className="dashboard-section">
              <div className="section-header">
                <h3 className="section-heading">Mis Notas</h3>
              </div>
              <div className="data-list">
                {data?.evaluaciones.map((evaluacion) => (
                  <div className="data-row" key={evaluacion.id}>
                    <div>
                      <strong>{evaluacion.grupo?.nombre ?? 'Grupo'}</strong>
                      <span>{evaluacion.descripcion ?? 'Evaluación'}</span>
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
