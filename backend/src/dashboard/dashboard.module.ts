import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Usuario } from '../entities/usuario.entity';
import { Programa } from '../entities/programa.entity';
import { Grupo } from '../entities/grupo.entity';
import { Matricula } from '../entities/matricula.entity';
import { Asistencia } from '../entities/asistencia.entity';
import { Evaluacion } from '../entities/evaluacion.entity';
import { Escenario } from '../entities/escenario.entity';
import { Reserva } from '../entities/reserva.entity';
import { Notificacion } from '../entities/notificacion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Usuario,
      Programa,
      Grupo,
      Matricula,
      Asistencia,
      Evaluacion,
      Escenario,
      Reserva,
      Notificacion,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
