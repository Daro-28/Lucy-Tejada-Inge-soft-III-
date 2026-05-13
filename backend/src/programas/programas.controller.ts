import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ProgramasService } from './programas.service';
import { CreateProgramaDto } from './dto/create-programa.dto';
import { UpdateProgramaDto } from './dto/update-programa.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Rol } from '../entities/enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('programas')
export class ProgramasController {
    constructor(private readonly programasService: ProgramasService) { }

    @Get()
    findAll() { return this.programasService.findAll(); }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) { return this.programasService.findOne(id); }

    @Roles(Rol.ADMIN)
    @Post()
    create(@Body() dto: CreateProgramaDto) { return this.programasService.create(dto); }

    @Roles(Rol.ADMIN)
    @Put(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateProgramaDto) {
        return this.programasService.update(id, dto);
    }

    @Roles(Rol.ADMIN)
    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) { return this.programasService.remove(id); }
}