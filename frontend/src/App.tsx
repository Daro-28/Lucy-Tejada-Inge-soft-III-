import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components/Guards';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { EstudianteDashboard } from './pages/EstudianteDashboard';
import { ProfesorDashboard } from './pages/ProfesorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rutas Privadas / Protegidas por Rol */}
          <Route element={<PrivateRoute allowedRoles={['ESTUDIANTE']} />}>
            <Route path="/estudiante" element={<EstudianteDashboard />} />
          </Route>
          
          <Route element={<PrivateRoute allowedRoles={['EDUCADOR']} />}>
            <Route path="/profesor" element={<ProfesorDashboard />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
