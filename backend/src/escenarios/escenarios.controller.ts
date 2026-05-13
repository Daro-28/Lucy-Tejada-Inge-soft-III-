import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { EscenariosService } from './escenarios.service';
import { CreateEscenarioDto } from './dto/create-escenario.dto';
import { UpdateEscenarioDto } from './dto/update-escenario.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Rol } from '../entities/enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('escenarios')
export class EscenariosController {
    constructor(private readonly escenariosService: EscenariosService) { }

    @Get()
    findAll() { return this.escenariosService.findAll(); }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) { return this.escenariosService.findOne(id); }

    @Roles(Rol.ADMIN)
    @Post()
    create(@Body() dto: CreateEscenarioDto) { return this.escenariosService.create(dto); }

    @Roles(Rol.ADMIN)
    @Put(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateEscenarioDto) {
        return this.escenariosService.update(id, dto);
    }

    @Roles(Rol.ADMIN)
    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) { return this.escenariosService.remove(id); }
}