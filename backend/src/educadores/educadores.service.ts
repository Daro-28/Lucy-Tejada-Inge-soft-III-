import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Educador } from '../entities/educador.entity';
import { CreateEducadorDto } from './dto/create-educador.dto';
import { UpdateEducadorDto } from './dto/update-educador.dto';

@Injectable()
export class EducadoresService {
    constructor(
        @InjectRepository(Educador)
        private readonly repo: Repository<Educador>,
    ) { }

    findAll() {
        return this.repo.find({ relations: ['usuario', 'grupos'] });
    }

    async findOne(id: string) {
        const educador = await this.repo.findOne({
            where: { id },
            relations: ['usuario', 'grupos', 'grupos.programa'],
        });
        if (!educador) throw new NotFoundException(`Educador ${id} no encontrado`);
        return educador;
    }

    async create(dto: CreateEducadorDto) {
        const educador = this.repo.create({ id: dto.usuarioId, especialidad: dto.especialidad });
        return this.repo.save(educador);
    }

    async update(id: string, dto: UpdateEducadorDto) {
        const educador = await this.findOne(id);
        if (dto.especialidad) educador.especialidad = dto.especialidad;
        return this.repo.save(educador);
    }

    async remove(id: string) {
        const educador = await this.findOne(id);
        await this.repo.remove(educador);
        return { message: `Educador ${id} eliminado` };
    }
}