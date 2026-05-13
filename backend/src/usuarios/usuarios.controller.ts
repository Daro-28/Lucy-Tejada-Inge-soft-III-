import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    UseGuards,
    ParseUUIDPipe,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Rol } from '../entities/enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) { }

    // Solo ADMIN puede ver todos los usuarios
    @Roles(Rol.ADMIN)
    @Get()
    findAll() {
        return this.usuariosService.findAll();
    }

    // Solo ADMIN puede ver un usuario por ID
    @Roles(Rol.ADMIN)
    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.usuariosService.findOne(id);
    }

    // Solo ADMIN puede crear usuarios directamente
    @Roles(Rol.ADMIN)
    @Post()
    create(@Body() dto: CreateUsuarioDto) {
        return this.usuariosService.create(dto);
    }

    // Solo ADMIN puede actualizar usuarios
    @Roles(Rol.ADMIN)
    @Put(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateUsuarioDto,
    ) {
        return this.usuariosService.update(id, dto);
    }

    // Solo ADMIN puede eliminar usuarios
    @Roles(Rol.ADMIN)
    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.usuariosService.remove(id);
    }
}