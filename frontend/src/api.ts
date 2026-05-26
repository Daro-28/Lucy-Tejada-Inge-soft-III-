export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export async function apiGet<T>(path: string, token: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || 'No se pudieron cargar los datos');
  }

  return data as T;
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: 'ESTUDIANTE' | 'EDUCADOR' | 'ADMIN';
  activo: boolean;
}

export interface Programa {
  id: string;
  nombre: string;
  descripcion?: string | null;
  grupos?: Grupo[];
}

export interface Grupo {
  id: string;
  nombre: string;
  horario?: string | null;
  cupoMaximo: number;
  programa?: Programa | null;
  educador?: { id: string; especialidad?: string | null; usuario?: Usuario } | null;
  matriculas?: Matricula[];
}

export interface Matricula {
  id: string;
  fecha: string;
  estado: 'ACTIVA' | 'CANCELADA' | 'FINALIZADA';
  estudiante?: { id: string; codigo?: string | null; usuario?: Usuario };
  grupo?: Grupo;
}

export interface Asistencia {
  id: string;
  fecha: string;
  presente: boolean;
  estudiante?: { id: string; usuario?: Usuario };
  grupo?: Grupo;
}

export interface Evaluacion {
  id: string;
  descripcion?: string | null;
  calificacion?: number | string | null;
  estudiante?: { id: string; usuario?: Usuario };
  grupo?: Grupo;
}

export interface Escenario {
  id: string;
  nombre: string;
  capacidad: number;
  estado: 'DISPONIBLE' | 'RESERVADO' | 'EN_MANTENIMIENTO';
  reservas?: Reserva[];
}

export interface Reserva {
  id: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  usuario?: Usuario;
  escenario?: Escenario;
}

export interface Notificacion {
  id: string;
  mensaje: string;
  fecha: string;
  usuario?: Usuario;
}

export interface AdminDashboardData {
  stats: {
    usuarios: number;
    programas: number;
    matriculasActivas: number;
    reservas: number;
    escenarios: number;
  };
  usuarios: Usuario[];
  programas: Programa[];
  grupos: Grupo[];
  matriculas: Matricula[];
  escenarios: Escenario[];
  reservas: Reserva[];
  notificaciones: Notificacion[];
}

export interface ProfesorDashboardData {
  stats: {
    grupos: number;
    estudiantesActivos: number;
    asistenciasRegistradas: number;
    evaluaciones: number;
  };
  grupos: Grupo[];
  asistencias: Asistencia[];
  evaluaciones: Evaluacion[];
  notificaciones: Notificacion[];
}

export interface EstudianteDashboardData {
  stats: {
    cursosInscritos: number;
    asistenciaPromedio: number;
    notaPromedio: number;
    notificaciones: number;
  };
  matriculas: Matricula[];
  asistencias: Asistencia[];
  evaluaciones: Evaluacion[];
  notificaciones: Notificacion[];
}
