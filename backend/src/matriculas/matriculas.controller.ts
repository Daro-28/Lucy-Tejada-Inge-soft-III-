import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { MatriculasService } from './matriculas.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Rol } from '../entities/enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('matriculas')
export class MatriculasController {
    constructor(private readonly matriculasService: MatriculasService) { }

    @Roles(Rol.ADMIN, Rol.EDUCADOR)
    @Get()
    findAll() { return this.matriculasService.findAll(); }

    @Roles(Rol.ADMIN, Rol.EDUCADOR)
    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) { return this.matriculasService.findOne(id); }

    @Roles(Rol.ADMIN, Rol.EDUCADOR)
    @Get('estudiante/:estudianteId')
    findByEstudiante(@Param('estudianteId', ParseUUIDPipe) estudianteId: string) {
        return this.matriculasService.findByEstudiante(estudianteId);
    }

    @Roles(Rol.ADMIN)
    @Post()
    create(@Body() dto: CreateMatriculaDto) { return this.matriculasService.create(dto); }

    @Roles(Rol.ADMIN)
    @Put(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateMatriculaDto) {
        return this.matriculasService.update(id, dto);
    }

    @Roles(Rol.ADMIN)
    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) { return this.matriculasService.remove(id); }
}