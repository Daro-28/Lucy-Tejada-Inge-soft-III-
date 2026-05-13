import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Escenario } from '../entities/escenario.entity';
import { CreateEscenarioDto } from './dto/create-escenario.dto';
import { UpdateEscenarioDto } from './dto/update-escenario.dto';

@Injectable()
export class EscenariosService {
    constructor(
        @InjectRepository(Escenario)
        private readonly repo: Repository<Escenario>,
    ) { }

    findAll() {
        return this.repo.find({ relations: ['reservas', 'mantenimientos'] });
    }

    async findOne(id: string) {
        const escenario = await this.repo.findOne({
            where: { id },
            relations: ['reservas', 'mantenimientos'],
        });
        if (!escenario) throw new NotFoundException(`Escenario ${id} no encontrado`);
        return escenario;
    }

    create(dto: CreateEscenarioDto) {
        const escenario = this.repo.create(dto);
        return this.repo.save(escenario);
    }

    async update(id: string, dto: UpdateEscenarioDto) {
        const escenario = await this.findOne(id);
        Object.assign(escenario, dto);
        return this.repo.save(escenario);
    }

    async remove(id: string) {
        const escenario = await this.findOne(id);
        await this.repo.remove(escenario);
        return { message: `Escenario ${id} eliminado` };
    }
}