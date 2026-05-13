import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Matricula } from '../entities/matricula.entity';
import { Estudiante } from '../entities/estudiante.entity';
import { Grupo } from '../entities/grupo.entity';
import { MatriculasService } from './matriculas.service';
import { MatriculasController } from './matriculas.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Matricula, Estudiante, Grupo]), AuthModule],
    controllers: [MatriculasController],
    providers: [MatriculasService],
    exports: [MatriculasService],
})
export class MatriculasModule { }