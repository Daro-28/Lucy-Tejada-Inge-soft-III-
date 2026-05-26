import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: 'ESTUDIANTE' | 'EDUCADOR' | 'ADMIN';
  activo: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Inicializar autenticación desde localStorage
    const savedToken = localStorage.getItem('lucy_token');
    const savedUser = localStorage.getItem('lucy_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing saved user from localStorage', e);
        localStorage.removeItem('lucy_token');
        localStorage.removeItem('lucy_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('lucy_token', newToken);
    localStorage.setItem('lucy_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('lucy_token');
    localStorage.removeItem('lucy_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
