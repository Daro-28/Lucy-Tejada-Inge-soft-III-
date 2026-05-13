import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Educador } from '../entities/educador.entity';
import { EducadoresService } from './educadores.service';
import { EducadoresController } from './educadores.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Educador]), AuthModule],
    controllers: [EducadoresController],
    providers: [EducadoresService],
    exports: [EducadoresService],
})
export class EducadoresModule { }