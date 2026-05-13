import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { EvaluacionesService } from './evaluaciones.service';
import { CreateEvaluacionDto } from './dto/create-evaluacion.dto';
import { UpdateEvaluacionDto } from './dto/update-evaluacion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Rol } from '../entities/enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('evaluaciones')
export class EvaluacionesController {
    constructor(private readonly evaluacionesService: EvaluacionesService) { }

    @Roles(Rol.ADMIN, Rol.EDUCADOR)
    @Get()
    findAll() { return this.evaluacionesService.findAll(); }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) { return this.evaluacionesService.findOne(id); }

    @Roles(Rol.ADMIN, Rol.EDUCADOR)
    @Get('grupo/:grupoId')
    findByGrupo(@Param('grupoId', ParseUUIDPipe) grupoId: string) {
        return this.evaluacionesService.findByGrupo(grupoId);
    }

    @Roles(Rol.ADMIN, Rol.EDUCADOR)
    @Post()
    create(@Body() dto: CreateEvaluacionDto) { return this.evaluacionesService.create(dto); }

    @Roles(Rol.ADMIN, Rol.EDUCADOR)
    @Put(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateEvaluacionDto) {
        return this.evaluacionesService.update(id, dto);
    }

    @Roles(Rol.ADMIN)
    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) { return this.evaluacionesService.remove(id); }
}