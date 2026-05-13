import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Escenario } from '../entities/escenario.entity';
import { EscenariosService } from './escenarios.service';
import { EscenariosController } from './escenarios.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Escenario]), AuthModule],
    controllers: [EscenariosController],
    providers: [EscenariosService],
    exports: [EscenariosService],
})
export class EscenariosModule { }