import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estudiante } from '../entities/estudiante.entity';
import { EstudiantesService } from './estudiantes.service';
import { EstudiantesController } from './estudiantes.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Estudiante]), AuthModule],
    controllers: [EstudiantesController],
    providers: [EstudiantesService],
    exports: [EstudiantesService],
})
export class EstudiantesModule { }