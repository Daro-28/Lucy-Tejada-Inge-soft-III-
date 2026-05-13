import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
import { UpdateNotificacionDto } from './dto/update-notificacion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Rol } from '../entities/enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('notificaciones')
export class NotificacionesController {
    constructor(private readonly notificacionesService: NotificacionesService) { }

    @Roles(Rol.ADMIN)
    @Get()
    findAll() { return this.notificacionesService.findAll(); }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) { return this.notificacionesService.findOne(id); }

    @Get('usuario/:usuarioId')
    findByUsuario(@Param('usuarioId', ParseUUIDPipe) usuarioId: string) {
        return this.notificacionesService.findByUsuario(usuarioId);
    }

    @Roles(Rol.ADMIN)
    @Post()
    create(@Body() dto: CreateNotificacionDto) { return this.notificacionesService.create(dto); }

    @Roles(Rol.ADMIN)
    @Put(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateNotificacionDto) {
        return this.notificacionesService.update(id, dto);
    }

    @Roles(Rol.ADMIN)
    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) { return this.notificacionesService.remove(id); }
}