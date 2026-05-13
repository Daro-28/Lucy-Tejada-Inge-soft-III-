import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { EducadoresService } from './educadores.service';
import { CreateEducadorDto } from './dto/create-educador.dto';
import { UpdateEducadorDto } from './dto/update-educador.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Rol } from '../entities/enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('educadores')
export class EducadoresController {
    constructor(private readonly educadoresService: EducadoresService) { }

    @Get()
    findAll() { return this.educadoresService.findAll(); }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) { return this.educadoresService.findOne(id); }

    @Roles(Rol.ADMIN)
    @Post()
    create(@Body() dto: CreateEducadorDto) { return this.educadoresService.create(dto); }

    @Roles(Rol.ADMIN)
    @Put(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateEducadorDto) {
        return this.educadoresService.update(id, dto);
    }

    @Roles(Rol.ADMIN)
    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) { return this.educadoresService.remove(id); }
}