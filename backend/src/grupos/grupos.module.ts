import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grupo } from '../entities/grupo.entity';
import { Educador } from '../entities/educador.entity';
import { Programa } from '../entities/programa.entity';
import { GruposService } from './grupos.service';
import { GruposController } from './grupos.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Grupo, Educador, Programa]), AuthModule],
    controllers: [GruposController],
    providers: [GruposService],
    exports: [GruposService],
})
export class GruposModule { }