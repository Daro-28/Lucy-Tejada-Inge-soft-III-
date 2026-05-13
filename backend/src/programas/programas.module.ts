import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Programa } from '../entities/programa.entity';
import { ProgramasService } from './programas.service';
import { ProgramasController } from './programas.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Programa]), AuthModule],
    controllers: [ProgramasController],
    providers: [ProgramasService],
    exports: [ProgramasService],
})
export class ProgramasModule { }