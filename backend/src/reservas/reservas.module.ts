import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from '../entities/reserva.entity';
import { Usuario } from '../entities/usuario.entity';
import { Escenario } from '../entities/escenario.entity';
import { ReservasService } from './reservas.service';
import { ReservasController } from './reservas.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Reserva, Usuario, Escenario]), AuthModule],
    controllers: [ReservasController],
    providers: [ReservasService],
    exports: [ReservasService],
})
export class ReservasModule { }