import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grupo } from '../entities/grupo.entity';
import { Educador } from '../entities/educador.entity';
import { Programa } from '../entities/programa.entity';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';

@Injectable()
export class GruposService {
    constructor(
        @InjectRepository(Grupo) private readonly repo: Repository<Grupo>,
        @InjectRepository(Educador) private readonly educadorRepo: Repository<Educador>,
        @InjectRepository(Programa) private readonly programaRepo: Repository<Programa>,
    ) { }

    findAll() {
        return this.repo.find({ relations: ['educador', 'programa', 'educador.usuario'] });
    }

    async findOne(id: string) {
        const grupo = await this.repo.findOne({
            where: { id },
            relations: ['educador', 'programa', 'educador.usuario', 'matriculas'],
        });
        if (!grupo) throw new NotFoundException(`Grupo ${id} no encontrado`);
        return grupo;
    }

    async create(dto: CreateGrupoDto) {
        const grupo = this.repo.create({
            nombre: dto.nombre,
            horario: dto.horario,
            cupoMaximo: dto.cupoMaximo,
        });
        if (dto.educadorId) {
            const educador = await this.educadorRepo.findOne({ where: { id: dto.educadorId } });
            if (!educador) throw new NotFoundException(`Educador ${dto.educadorId} no encontrado`);
            grupo.educador = educador;
        }
        if (dto.programaId) {
            const programa = await this.programaRepo.findOne({ where: { id: dto.programaId } });
            if (!programa) throw new NotFoundException(`Programa ${dto.programaId} no encontrado`);
            grupo.programa = programa;
        }
        return this.repo.save(grupo);
    }

    async update(id: string, dto: UpdateGrupoDto) {
        const grupo = await this.findOne(id);
        if (dto.educadorId) {
            const educador = await this.educadorRepo.findOne({ where: { id: dto.educadorId } });
            if (!educador) throw new NotFoundException(`Educador ${dto.educadorId} no encontrado`);
            grupo.educador = educador;
        }
        if (dto.programaId) {
            const programa = await this.programaRepo.findOne({ where: { id: dto.programaId } });
            if (!programa) throw new NotFoundException(`Programa ${dto.programaId} no encontrado`);
            grupo.programa = programa;
        }
        const { educadorId, programaId, ...rest } = dto;
        Object.assign(grupo, rest);
        return this.repo.save(grupo);
    }

    async remove(id: string) {
        const grupo = await this.findOne(id);
        await this.repo.remove(grupo);
        return { message: `Grupo ${id} eliminado` };
    }
}