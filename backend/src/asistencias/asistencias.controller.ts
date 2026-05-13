import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { AsistenciasService } from './asistencias.service';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { UpdateAsistenciaDto } from './dto/update-asistencia.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Rol } from '../entities/enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('asistencias')
export class AsistenciasController {
    constructor(private readonly asistenciasService: AsistenciasService) { }

    @Roles(Rol.ADMIN, Rol.EDUCADOR)
    @Get()
    findAll() { return this.asistenciasService.findAll(); }

    @Roles(Rol.ADMIN, Rol.EDUCADOR)
    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) { return this.asistenciasService.findOne(id); }

    @Roles(Rol.ADMIN, Rol.EDUCADOR)
    @Get('grupo/:grupoId')
    findByGrupo(@Param('grupoId', ParseUUIDPipe) grupoId: string) {
        return this.asistenciasService.findByGrupo(grupoId);
    }

    @Roles(Rol.ADMIN, Rol.EDUCADOR)
    @Post()
    create(@Body() dto: CreateAsistenciaDto) { return this.asistenciasService.create(dto); }

    @Roles(Rol.ADMIN, Rol.EDUCADOR)
    @Put(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAsistenciaDto) {
        return this.asistenciasService.update(id, dto);
    }

    @Roles(Rol.ADMIN)
    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) { return this.asistenciasService.remove(id); }
}