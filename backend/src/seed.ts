import 'reflect-metadata';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { Estudiante } from './entities/estudiante.entity';
import { Educador } from './entities/educador.entity';
import { Administrador } from './entities/administrador.entity';
import { Programa } from './entities/programa.entity';
import { Grupo } from './entities/grupo.entity';
import { Matricula } from './entities/matricula.entity';
import { Contrato } from './entities/contrato.entity';
import { Pago } from './entities/pago.entity';
import { Asistencia } from './entities/asistencia.entity';
import { Evaluacion } from './entities/evaluacion.entity';
import { Escenario } from './entities/escenario.entity';
import { Reserva } from './entities/reserva.entity';
import { Mantenimiento } from './entities/mantenimiento.entity';
import { OrdenTrabajo } from './entities/orden-trabajo.entity';
import { Inventario } from './entities/inventario.entity';
import { Notificacion } from './entities/notificacion.entity';
import { Archivo } from './entities/archivo.entity';
import { Reporte } from './entities/reporte.entity';
import { EstadoEscenario, EstadoMatricula, Rol, TipoMantenimiento } from './entities/enums';

const entities = [
  Usuario,
  Estudiante,
  Educador,
  Administrador,
  Programa,
  Grupo,
  Matricula,
  Contrato,
  Pago,
  Asistencia,
  Evaluacion,
  Escenario,
  Reserva,
  Mantenimiento,
  OrdenTrabajo,
  Inventario,
  Notificacion,
  Archivo,
  Reporte,
];

function loadEnv() {
  const envPath = join(__dirname, '..', '.env');
  if (!existsSync(envPath)) return;

  const env = readFileSync(envPath, 'utf8');
  for (const line of env.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...valueParts] = trimmed.split('=');
    if (!key || process.env[key]) continue;
    process.env[key] = valueParts.join('=').replace(/^["']|["']$/g, '');
  }
}

async function findOrCreate<T extends { id: string }>(
  repo: Repository<T>,
  where: Parameters<Repository<T>['findOne']>[0]['where'],
  data: Partial<T>,
) {
  const existing = await repo.findOne({ where });
  if (existing) return existing;
  return repo.save(repo.create(data as T));
}

async function seed() {
  loadEnv();

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL no está definido en backend/.env');
  }

  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: true,
    extra: {
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
    },
    entities,
    synchronize: false,
  });

  await dataSource.initialize();

  const usuarioRepo = dataSource.getRepository(Usuario);
  const estudianteRepo = dataSource.getRepository(Estudiante);
  const educadorRepo = dataSource.getRepository(Educador);
  const administradorRepo = dataSource.getRepository(Administrador);
  const programaRepo = dataSource.getRepository(Programa);
  const grupoRepo = dataSource.getRepository(Grupo);
  const matriculaRepo = dataSource.getRepository(Matricula);
  const asistenciaRepo = dataSource.getRepository(Asistencia);
  const evaluacionRepo = dataSource.getRepository(Evaluacion);
  const escenarioRepo = dataSource.getRepository(Escenario);
  const reservaRepo = dataSource.getRepository(Reserva);
  const notificacionRepo = dataSource.getRepository(Notificacion);
  const contratoRepo = dataSource.getRepository(Contrato);
  const pagoRepo = dataSource.getRepository(Pago);
  const mantenimientoRepo = dataSource.getRepository(Mantenimiento);
  const ordenRepo = dataSource.getRepository(OrdenTrabajo);
  const inventarioRepo = dataSource.getRepository(Inventario);
  const archivoRepo = dataSource.getRepository(Archivo);
  const reporteRepo = dataSource.getRepository(Reporte);

  const password = await bcrypt.hash('Prueba123', 10);
  const users = [
    { nombre: 'Ana Administradora', email: 'admin@lucytejada.edu.co', rol: Rol.ADMIN },
    { nombre: 'Carlos Educador', email: 'profesor@lucytejada.edu.co', rol: Rol.EDUCADOR },
    { nombre: 'Laura Estudiante', email: 'estudiante@lucytejada.edu.co', rol: Rol.ESTUDIANTE },
  ];

  const savedUsers = await Promise.all(
    users.map(async (user) => {
      let saved = await usuarioRepo.findOne({ where: { email: user.email }, select: ['id', 'nombre', 'email', 'password', 'rol', 'activo'] });
      if (!saved) {
        saved = await usuarioRepo.save(usuarioRepo.create({ ...user, password, activo: true }));
      } else {
        saved.nombre = user.nombre;
        saved.rol = user.rol;
        saved.activo = true;
        saved.password = password;
        await usuarioRepo.save(saved);
      }
      return saved;
    }),
  );

  const [adminUser, educadorUser, estudianteUser] = savedUsers;
  await findOrCreate(administradorRepo, { id: adminUser.id }, { id: adminUser.id });
  const educador = await findOrCreate(educadorRepo, { id: educadorUser.id }, { id: educadorUser.id, especialidad: 'Artes plásticas y pintura' });
  educador.especialidad = 'Artes plásticas y pintura';
  await educadorRepo.save(educador);
  const estudiante = await findOrCreate(estudianteRepo, { id: estudianteUser.id }, { id: estudianteUser.id, codigo: 'EST-2026-001', fechaRegistro: new Date('2026-05-20') });
  estudiante.codigo = 'EST-2026-001';
  await estudianteRepo.save(estudiante);

  const musica = await findOrCreate(programaRepo, { nombre: 'Música' }, { nombre: 'Música', descripcion: 'Formación en instrumentos, solfeo y ensamble musical.' });
  const danza = await findOrCreate(programaRepo, { nombre: 'Danza y Teatro' }, { nombre: 'Danza y Teatro', descripcion: 'Expresión corporal, danza folclórica y actuación escénica.' });
  const plasticas = await findOrCreate(programaRepo, { nombre: 'Artes Plásticas' }, { nombre: 'Artes Plásticas', descripcion: 'Pintura, dibujo, escultura y técnicas mixtas.' });

  const pinturaGrupo = await findOrCreate(grupoRepo, { nombre: 'Pintura Inicial A' }, { nombre: 'Pintura Inicial A', horario: 'Lunes y Miércoles 16:00-18:00', cupoMaximo: 20, educador, programa: plasticas });
  Object.assign(pinturaGrupo, { horario: 'Lunes y Miércoles 16:00-18:00', cupoMaximo: 20, educador, programa: plasticas });
  await grupoRepo.save(pinturaGrupo);
  const guitarraGrupo = await findOrCreate(grupoRepo, { nombre: 'Guitarra Juvenil' }, { nombre: 'Guitarra Juvenil', horario: 'Martes y Jueves 15:00-17:00', cupoMaximo: 18, educador, programa: musica });
  Object.assign(guitarraGrupo, { horario: 'Martes y Jueves 15:00-17:00', cupoMaximo: 18, educador, programa: musica });
  await grupoRepo.save(guitarraGrupo);
  const teatroGrupo = await findOrCreate(grupoRepo, { nombre: 'Teatro Exploratorio' }, { nombre: 'Teatro Exploratorio', horario: 'Sábados 09:00-12:00', cupoMaximo: 25, educador, programa: danza });
  Object.assign(teatroGrupo, { horario: 'Sábados 09:00-12:00', cupoMaximo: 25, educador, programa: danza });
  await grupoRepo.save(teatroGrupo);

  for (const grupo of [pinturaGrupo, guitarraGrupo]) {
    await findOrCreate(matriculaRepo, { estudiante: { id: estudiante.id }, grupo: { id: grupo.id } }, { estudiante, grupo, estado: EstadoMatricula.ACTIVA, fecha: new Date('2026-05-21') });
  }

  const fechas = ['2026-05-21', '2026-05-23', '2026-05-25'];
  for (const grupo of [pinturaGrupo, guitarraGrupo]) {
    for (const [index, fecha] of fechas.entries()) {
      await findOrCreate(
        asistenciaRepo,
        { estudiante: { id: estudiante.id }, grupo: { id: grupo.id }, fecha: new Date(fecha) },
        { estudiante, grupo, fecha: new Date(fecha), presente: index !== 1 || grupo.id === guitarraGrupo.id },
      );
    }
    await findOrCreate(
      evaluacionRepo,
      { estudiante: { id: estudiante.id }, grupo: { id: grupo.id }, descripcion: `Proceso inicial - ${grupo.nombre}` },
      { estudiante, grupo, descripcion: `Proceso inicial - ${grupo.nombre}`, calificacion: grupo.id === pinturaGrupo.id ? 4.7 : 4.4 },
    );
  }

  const auditorio = await findOrCreate(escenarioRepo, { nombre: 'Auditorio Principal' }, { nombre: 'Auditorio Principal', capacidad: 220, estado: EstadoEscenario.DISPONIBLE });
  const salonDanza = await findOrCreate(escenarioRepo, { nombre: 'Salón de Danza 2' }, { nombre: 'Salón de Danza 2', capacidad: 45, estado: EstadoEscenario.EN_MANTENIMIENTO });
  const taller = await findOrCreate(escenarioRepo, { nombre: 'Taller de Artes Plásticas' }, { nombre: 'Taller de Artes Plásticas', capacidad: 30, estado: EstadoEscenario.RESERVADO });

  await findOrCreate(reservaRepo, { escenario: { id: auditorio.id }, fecha: new Date('2026-06-01'), horaInicio: '09:00:00' }, { usuario: adminUser, escenario: auditorio, fecha: new Date('2026-06-01'), horaInicio: '09:00:00', horaFin: '11:00:00' });
  await findOrCreate(reservaRepo, { escenario: { id: taller.id }, fecha: new Date('2026-06-03'), horaInicio: '16:00:00' }, { usuario: educadorUser, escenario: taller, fecha: new Date('2026-06-03'), horaInicio: '16:00:00', horaFin: '18:00:00' });

  for (const item of [
    { usuario: estudianteUser, mensaje: 'Tu matrícula en Pintura Inicial A está activa.' },
    { usuario: estudianteUser, mensaje: 'Recuerda asistir a la clase del miércoles a las 4:00 p.m.' },
    { usuario: educadorUser, mensaje: 'Tienes 3 grupos asignados para el periodo actual.' },
    { usuario: adminUser, mensaje: 'Base de datos inicial cargada con datos de prueba.' },
  ]) {
    await findOrCreate(notificacionRepo, { usuario: { id: item.usuario.id }, mensaje: item.mensaje }, { ...item, fecha: new Date('2026-05-25') });
  }

  const contrato = await findOrCreate(contratoRepo, { estudiante: { id: estudiante.id }, fechaInicio: new Date('2026-05-21') }, { estudiante, valor: 320000, monto: 320000, fechaInicio: new Date('2026-05-21'), fechaFin: new Date('2026-08-21') });
  await findOrCreate(pagoRepo, { contrato: { id: contrato.id }, fecha: new Date('2026-05-22') }, { contrato, monto: 320000, fecha: new Date('2026-05-22') });

  const mantenimiento = await findOrCreate(mantenimientoRepo, { escenario: { id: salonDanza.id }, fecha: new Date('2026-05-28') }, { escenario: salonDanza, tipo: TipoMantenimiento.PREVENTIVO, fecha: new Date('2026-05-28'), descripcion: 'Revisión de piso, luces y sonido.' });
  const orden = await findOrCreate(ordenRepo, { mantenimiento: { id: mantenimiento.id }, fecha: new Date('2026-05-26') }, { administrador: { id: adminUser.id } as Administrador, mantenimiento, estado: 'ABIERTA', fecha: new Date('2026-05-26') });
  await findOrCreate(inventarioRepo, { nombre: 'Caballetes de pintura' }, { nombre: 'Caballetes de pintura', cantidad: 18, ordenTrabajo: orden });

  const archivo = await findOrCreate(archivoRepo, { url: '/reportes/matriculas-mayo-2026.pdf' }, { url: '/reportes/matriculas-mayo-2026.pdf', tipo: 'PDF' });
  await findOrCreate(reporteRepo, { tipo: 'Matrículas activas', fechaGeneracion: new Date('2026-05-25') }, { tipo: 'Matrículas activas', administrador: { id: adminUser.id } as Administrador, archivo, fechaGeneracion: new Date('2026-05-25') });

  await dataSource.destroy();

  console.log('Seed completado.');
  console.log('Usuarios de prueba:');
  console.log('ADMIN: admin@lucytejada.edu.co / Prueba123');
  console.log('EDUCADOR: profesor@lucytejada.edu.co / Prueba123');
  console.log('ESTUDIANTE: estudiante@lucytejada.edu.co / Prueba123');
}

seed().catch((error) => {
  console.error('Error ejecutando seed:', error);
  process.exit(1);
});
