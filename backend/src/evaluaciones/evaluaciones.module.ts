import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evaluacion } from '../entities/evaluacion.entity';
import { Estudiante } from '../entities/estudiante.entity';
import { Grupo } from '../entities/grupo.entity';
import { EvaluacionesService } from './evaluaciones.service';
import { EvaluacionesController } from './evaluaciones.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Evaluacion, Estudiante, Grupo]), AuthModule],
    controllers: [EvaluacionesController],
    providers: [EvaluacionesService],
    exports: [EvaluacionesService],
})
export class EvaluacionesModule { }