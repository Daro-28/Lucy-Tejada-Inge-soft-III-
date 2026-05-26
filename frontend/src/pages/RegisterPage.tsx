import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, AlertCircle, CheckCircle, Palette, Briefcase, GraduationCap } from 'lucide-react';
import { API_URL } from '../api';

export const RegisterPage: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rol, setRol] = useState<'ESTUDIANTE' | 'EDUCADOR' | 'ADMIN'>('ESTUDIANTE');
  
  // Campos dinámicos por rol
  const [codigo, setCodigo] = useState('');
  const [especialidad, setEspecialidad] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validar coincidencia de contraseña
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const payload: any = {
        nombre,
        email,
        password,
        rol,
      };

      // Incluir campos específicos por rol
      if (rol === 'ESTUDIANTE') {
        if (codigo) payload.codigo = codigo;
      } else if (rol === 'EDUCADOR') {
        if (especialidad) payload.especialidad = especialidad;
      }

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en el registro');
      }

      setSuccess('Usuario registrado con éxito. Redirigiendo al login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container" style={{ minHeight: 'calc(100vh - 80px)', padding: '2rem 5%' }}>
      <div className="hero-bg-glow"></div>
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        <div className="auth-header">
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--accent)' }}>
            <Palette size={32} />
            <span style={{ fontWeight: '800', fontSize: '1.25rem', color: '#fff' }}>Lucy Tejada</span>
          </Link>
          <h2 className="auth-title">Crear Cuenta</h2>
          <p className="auth-subtitle">Regístrate para comenzar tu formación artística</p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
            <CheckCircle size={20} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Nombre Completo</label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input
                type="text"
                className="form-input"
                placeholder="Juan Pérez"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                disabled={loading || !!success}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                className="form-input"
                placeholder="juan@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || !!success}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Selecciona tu Rol</label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <select
                className="form-select"
                value={rol}
                onChange={(e) => setRol(e.target.value as any)}
                required
                disabled={loading || !!success}
              >
                <option value="ESTUDIANTE">Estudiante</option>
                <option value="EDUCADOR">Educador / Profesor</option>
                <option value="ADMIN">Administrativo / Admin</option>
              </select>
            </div>
          </div>

          {/* Campos condicionales */}
          {rol === 'ESTUDIANTE' && (
            <div className="form-group" style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <label className="form-label">Código Estudiantil (Opcional)</label>
              <div className="input-wrapper">
                <GraduationCap className="input-icon" size={18} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="EST-12345"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  disabled={loading || !!success}
                />
              </div>
            </div>
          )}

          {rol === 'EDUCADOR' && (
            <div className="form-group" style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <label className="form-label">Especialidad Artística (Opcional)</label>
              <div className="input-wrapper">
                <Briefcase className="input-icon" size={18} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Pintura, Música Clásica, Danza Contemporánea"
                  value={especialidad}
                  onChange={(e) => setEspecialidad(e.target.value)}
                  disabled={loading || !!success}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                className="form-input"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || !!success}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirmar Contraseña</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                className="form-input"
                placeholder="Repite la contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading || !!success}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem', justifyContent: 'center', marginTop: '1rem' }} disabled={loading || !!success}>
            {loading ? (
              <span className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></span>
            ) : (
              <>
                <UserPlus size={18} />
                Crear Cuenta
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="auth-link">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
};
