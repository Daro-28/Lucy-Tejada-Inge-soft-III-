import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Usuario } from '../entities/usuario.entity';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Usuario]),
        AuthModule, // provee JwtAuthGuard y RolesGuard
    ],
    controllers: [UsuariosController],
    providers: [UsuariosService],
    exports: [UsuariosService], // por si otros módulos lo necesitan
})
export class UsuariosModule { }