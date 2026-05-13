import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asistencia } from '../entities/asistencia.entity';
import { Estudiante } from '../entities/estudiante.entity';
import { Grupo } from '../entities/grupo.entity';
import { AsistenciasService } from './asistencias.service';
import { AsistenciasController } from './asistencias.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Asistencia, Estudiante, Grupo]), AuthModule],
    controllers: [AsistenciasController],
    providers: [AsistenciasService],
    exports: [AsistenciasService],
})
export class AsistenciasModule { }