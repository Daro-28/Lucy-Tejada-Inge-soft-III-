import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evaluacion } from '../entities/evaluacion.entity';
import { Estudiante } from '../entities/estudiante.entity';
import { Grupo } from '../entities/grupo.entity';
import { CreateEvaluacionDto } from './dto/create-evaluacion.dto';
import { UpdateEvaluacionDto } from './dto/update-evaluacion.dto';

@Injectable()
export class EvaluacionesService {
    constructor(
        @InjectRepository(Evaluacion) private readonly repo: Repository<Evaluacion>,
        @InjectRepository(Estudiante) private readonly estudianteRepo: Repository<Estudiante>,
        @InjectRepository(Grupo) private readonly grupoRepo: Repository<Grupo>,
    ) { }

    findAll() {
        return this.repo.find({ relations: ['estudiante', 'grupo', 'estudiante.usuario'] });
    }

    async findOne(id: string) {
        const evaluacion = await this.repo.findOne({
            where: { id },
            relations: ['estudiante', 'grupo', 'estudiante.usuario'],
        });
        if (!evaluacion) throw new NotFoundException(`Evaluación ${id} no encontrada`);
        return evaluacion;
    }

    findByGrupo(grupoId: string) {
        return this.repo.find({
            where: { grupo: { id: grupoId } },
            relations: ['estudiante', 'estudiante.usuario'],
        });
    }

    async create(dto: CreateEvaluacionDto) {
        const estudiante = await this.estudianteRepo.findOne({ where: { id: dto.estudianteId } });
        if (!estudiante) throw new NotFoundException(`Estudiante ${dto.estudianteId} no encontrado`);
        const grupo = await this.grupoRepo.findOne({ where: { id: dto.grupoId } });
        if (!grupo) throw new NotFoundException(`Grupo ${dto.grupoId} no encontrado`);
        const evaluacion = this.repo.create({ estudiante, grupo, descripcion: dto.descripcion, calificacion: dto.calificacion });
        return this.repo.save(evaluacion);
    }

    async update(id: string, dto: UpdateEvaluacionDto) {
        const evaluacion = await this.findOne(id);
        const { estudianteId, grupoId, ...rest } = dto;
        Object.assign(evaluacion, rest);
        return this.repo.save(evaluacion);
    }

    async remove(id: string) {
        const evaluacion = await this.findOne(id);
        await this.repo.remove(evaluacion);
        return { message: `Evaluación ${id} eliminada` };
    }
}