import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Programa } from '../entities/programa.entity';
import { CreateProgramaDto } from './dto/create-programa.dto';
import { UpdateProgramaDto } from './dto/update-programa.dto';

@Injectable()
export class ProgramasService {
    constructor(
        @InjectRepository(Programa)
        private readonly repo: Repository<Programa>,
    ) { }

    findAll() {
        return this.repo.find({ relations: ['grupos'] });
    }

    async findOne(id: string) {
        const programa = await this.repo.findOne({ where: { id }, relations: ['grupos'] });
        if (!programa) throw new NotFoundException(`Programa ${id} no encontrado`);
        return programa;
    }

    create(dto: CreateProgramaDto) {
        const programa = this.repo.create(dto);
        return this.repo.save(programa);
    }

    async update(id: string, dto: UpdateProgramaDto) {
        const programa = await this.findOne(id);
        Object.assign(programa, dto);
        return this.repo.save(programa);
    }

    async remove(id: string) {
        const programa = await this.findOne(id);
        await this.repo.remove(programa);
        return { message: `Programa ${id} eliminado` };
    }
}