import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

// Entidades
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

const ENTITIES = [
  Usuario, Estudiante, Educador, Administrador,
  Programa, Grupo, Matricula, Contrato, Pago,
  Asistencia, Evaluacion, Escenario, Reserva,
  Mantenimiento, OrdenTrabajo, Inventario,
  Notificacion, Archivo, Reporte,
];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (config: ConfigService) => ({
      type: 'postgres',
      url: config.get<string>('DATABASE_URL'),
      ssl: {
        rejectUnauthorized: false,
      },
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
      entities: ENTITIES,
      synchronize: false,
      logging: true, // 👈 temporal para ver conexión
    }),
    inject: [ConfigService],
  }),
  AuthModule,
  ],
})
export class AppModule {}
