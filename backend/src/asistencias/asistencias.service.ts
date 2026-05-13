import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asistencia } from '../entities/asistencia.entity';
import { Estudiante } from '../entities/estudiante.entity';
import { Grupo } from '../entities/grupo.entity';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { UpdateAsistenciaDto } from './dto/update-asistencia.dto';

@Injectable()
export class AsistenciasService {
    constructor(
        @InjectRepository(Asistencia) private readonly repo: Repository<Asistencia>,
        @InjectRepository(Estudiante) private readonly estudianteRepo: Repository<Estudiante>,
        @InjectRepository(Grupo) private readonly grupoRepo: Repository<Grupo>,
    ) { }

    findAll() {
        return this.repo.find({ relations: ['estudiante', 'grupo', 'estudiante.usuario'] });
    }

    async findOne(id: string) {
        const asistencia = await this.repo.findOne({
            where: { id },
            relations: ['estudiante', 'grupo', 'estudiante.usuario'],
        });
        if (!asistencia) throw new NotFoundException(`Asistencia ${id} no encontrada`);
        return asistencia;
    }

    findByGrupo(grupoId: string) {
        return this.repo.find({
            where: { grupo: { id: grupoId } },
            relations: ['estudiante', 'estudiante.usuario'],
            order: { fecha: 'DESC' },
        });
    }

    async create(dto: CreateAsistenciaDto) {
        const estudiante = await this.estudianteRepo.findOne({ where: { id: dto.estudianteId } });
        if (!estudiante) throw new NotFoundException(`Estudiante ${dto.estudianteId} no encontrado`);
        const grupo = await this.grupoRepo.findOne({ where: { id: dto.grupoId } });
        if (!grupo) throw new NotFoundException(`Grupo ${dto.grupoId} no encontrado`);
        const asistencia = this.repo.create({
            estudiante,
            grupo,
            fecha: new Date(dto.fecha),
            presente: dto.presente ?? false,
        });
        return this.repo.save(asistencia);
    }

    async update(id: string, dto: UpdateAsistenciaDto) {
        const asistencia = await this.findOne(id);
        asistencia.presente = dto.presente;
        return this.repo.save(asistencia);
    }

    async remove(id: string) {
        const asistencia = await this.findOne(id);
        await this.repo.remove(asistencia);
        return { message: `Asistencia ${id} eliminada` };
    }
}