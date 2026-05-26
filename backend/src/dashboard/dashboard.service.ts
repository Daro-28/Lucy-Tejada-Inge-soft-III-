import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Programa } from '../entities/programa.entity';
import { Grupo } from '../entities/grupo.entity';
import { Matricula } from '../entities/matricula.entity';
import { Asistencia } from '../entities/asistencia.entity';
import { Evaluacion } from '../entities/evaluacion.entity';
import { Escenario } from '../entities/escenario.entity';
import { Reserva } from '../entities/reserva.entity';
import { Notificacion } from '../entities/notificacion.entity';
import { EstadoMatricula } from '../entities/enums';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Usuario) private readonly usuarios: Repository<Usuario>,
    @InjectRepository(Programa) private readonly programas: Repository<Programa>,
    @InjectRepository(Grupo) private readonly grupos: Repository<Grupo>,
    @InjectRepository(Matricula) private readonly matriculas: Repository<Matricula>,
    @InjectRepository(Asistencia) private readonly asistencias: Repository<Asistencia>,
    @InjectRepository(Evaluacion) private readonly evaluaciones: Repository<Evaluacion>,
    @InjectRepository(Escenario) private readonly escenarios: Repository<Escenario>,
    @InjectRepository(Reserva) private readonly reservas: Repository<Reserva>,
    @InjectRepository(Notificacion) private readonly notificaciones: Repository<Notificacion>,
  ) {}

  async getAdminDashboard() {
    const [
      usuarios,
      programas,
      grupos,
      matriculas,
      escenarios,
      reservas,
      notificaciones,
    ] = await Promise.all([
      this.usuarios.find({ order: { nombre: 'ASC' } }),
      this.programas.find({ relations: ['grupos'], order: { nombre: 'ASC' } }),
      this.grupos.find({ relations: ['programa', 'educador', 'educador.usuario', 'matriculas'], order: { nombre: 'ASC' } }),
      this.matriculas.find({ relations: ['estudiante', 'estudiante.usuario', 'grupo', 'grupo.programa'], order: { fecha: 'DESC' } }),
      this.escenarios.find({ relations: ['reservas'], order: { nombre: 'ASC' } }),
      this.reservas.find({ relations: ['usuario', 'escenario'], order: { fecha: 'ASC', horaInicio: 'ASC' } }),
      this.notificaciones.find({ relations: ['usuario'], order: { fecha: 'DESC' }, take: 8 }),
    ]);

    return {
      stats: {
        usuarios: usuarios.length,
        programas: programas.length,
        matriculasActivas: matriculas.filter((m) => m.estado === EstadoMatricula.ACTIVA).length,
        reservas: reservas.length,
        escenarios: escenarios.length,
      },
      usuarios: usuarios.map(({ password, ...usuario }) => usuario),
      programas,
      grupos,
      matriculas,
      escenarios,
      reservas,
      notificaciones,
    };
  }

  async getProfesorDashboard(userId: string) {
    const grupos = await this.grupos.find({
      where: { educador: { id: userId } },
      relations: ['programa', 'matriculas', 'matriculas.estudiante', 'matriculas.estudiante.usuario'],
      order: { nombre: 'ASC' },
    });
    const grupoIds = grupos.map((grupo) => grupo.id);
    const [asistencias, evaluaciones, notificaciones] = await Promise.all([
      grupoIds.length
        ? this.asistencias.find({ where: { grupo: { id: In(grupoIds) } }, relations: ['grupo', 'estudiante', 'estudiante.usuario'], order: { fecha: 'DESC' } })
        : Promise.resolve([]),
      grupoIds.length
        ? this.evaluaciones.find({ where: { grupo: { id: In(grupoIds) } }, relations: ['grupo', 'estudiante', 'estudiante.usuario'] })
        : Promise.resolve([]),
      this.notificaciones.find({ where: { usuario: { id: userId } }, order: { fecha: 'DESC' }, take: 8 }),
    ]);
    const estudiantesActivos = new Set(
      grupos.flatMap((grupo) =>
        grupo.matriculas
          .filter((matricula) => matricula.estado === EstadoMatricula.ACTIVA)
          .map((matricula) => matricula.estudiante.id),
      ),
    );

    return {
      stats: {
        grupos: grupos.length,
        estudiantesActivos: estudiantesActivos.size,
        asistenciasRegistradas: asistencias.length,
        evaluaciones: evaluaciones.length,
      },
      grupos,
      asistencias,
      evaluaciones,
      notificaciones,
    };
  }

  async getEstudianteDashboard(userId: string) {
    const [matriculas, asistencias, evaluaciones, notificaciones] = await Promise.all([
      this.matriculas.find({
        where: { estudiante: { id: userId } },
        relations: ['grupo', 'grupo.programa', 'grupo.educador', 'grupo.educador.usuario'],
        order: { fecha: 'DESC' },
      }),
      this.asistencias.find({
        where: { estudiante: { id: userId } },
        relations: ['grupo', 'grupo.programa'],
        order: { fecha: 'DESC' },
      }),
      this.evaluaciones.find({
        where: { estudiante: { id: userId } },
        relations: ['grupo', 'grupo.programa'],
      }),
      this.notificaciones.find({ where: { usuario: { id: userId } }, order: { fecha: 'DESC' }, take: 8 }),
    ]);
    const asistenciasConRegistro = asistencias.length;
    const asistenciasPresentes = asistencias.filter((asistencia) => asistencia.presente).length;
    const evaluacionesConNota = evaluaciones.filter((evaluacion) => evaluacion.calificacion !== null && evaluacion.calificacion !== undefined);

    return {
      stats: {
        cursosInscritos: matriculas.filter((matricula) => matricula.estado === EstadoMatricula.ACTIVA).length,
        asistenciaPromedio: asistenciasConRegistro ? Math.round((asistenciasPresentes / asistenciasConRegistro) * 100) : 0,
        notaPromedio: evaluacionesConNota.length
          ? Number((evaluacionesConNota.reduce((total, evaluacion) => total + Number(evaluacion.calificacion), 0) / evaluacionesConNota.length).toFixed(1))
          : 0,
        notificaciones: notificaciones.length,
      },
      matriculas,
      asistencias,
      evaluaciones,
      notificaciones,
    };
  }
}
