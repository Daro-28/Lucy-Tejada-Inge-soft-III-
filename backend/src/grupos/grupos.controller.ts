import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { GruposService } from './grupos.service';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Rol } from '../entities/enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('grupos')
export class GruposController {
    constructor(private readonly gruposService: GruposService) { }

    @Get()
    findAll() { return this.gruposService.findAll(); }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) { return this.gruposService.findOne(id); }

    @Roles(Rol.ADMIN, Rol.EDUCADOR)
    @Post()
    create(@Body() dto: CreateGrupoDto) { return this.gruposService.create(dto); }

    @Roles(Rol.ADMIN, Rol.EDUCADOR)
    @Put(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateGrupoDto) {
        return this.gruposService.update(id, dto);
    }

    @Roles(Rol.ADMIN)
    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) { return this.gruposService.remove(id); }
}