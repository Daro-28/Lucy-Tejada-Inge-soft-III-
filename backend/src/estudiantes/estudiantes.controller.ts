import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { EstudiantesService } from './estudiantes.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Rol } from '../entities/enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('estudiantes')
export class EstudiantesController {
    constructor(private readonly estudiantesService: EstudiantesService) { }

    @Roles(Rol.ADMIN, Rol.EDUCADOR)
    @Get()
    findAll() { return this.estudiantesService.findAll(); }

    @Roles(Rol.ADMIN, Rol.EDUCADOR)
    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) { return this.estudiantesService.findOne(id); }

    @Roles(Rol.ADMIN)
    @Post()
    create(@Body() dto: CreateEstudianteDto) { return this.estudiantesService.create(dto); }

    @Roles(Rol.ADMIN)
    @Put(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateEstudianteDto) {
        return this.estudiantesService.update(id, dto);
    }

    @Roles(Rol.ADMIN)
    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) { return this.estudiantesService.remove(id); }
}