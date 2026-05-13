import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Matricula } from '../entities/matricula.entity';
import { Estudiante } from '../entities/estudiante.entity';
import { Grupo } from '../entities/grupo.entity';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';
import { EstadoMatricula } from '../entities/enums';

@Injectable()
export class MatriculasService {
    constructor(
        @InjectRepository(Matricula) private readonly repo: Repository<Matricula>,
        @InjectRepository(Estudiante) private readonly estudianteRepo: Repository<Estudiante>,
        @InjectRepository(Grupo) private readonly grupoRepo: Repository<Grupo>,
    ) { }

    findAll() {
        return this.repo.find({ relations: ['estudiante', 'grupo', 'estudiante.usuario'] });
    }

    async findOne(id: string) {
        const matricula = await this.repo.findOne({
            where: { id },
            relations: ['estudiante', 'grupo', 'estudiante.usuario', 'grupo.programa'],
        });
        if (!matricula) throw new NotFoundException(`Matrícula ${id} no encontrada`);
        return matricula;
    }

    async findByEstudiante(estudianteId: string) {
        return this.repo.find({
            where: { estudiante: { id: estudianteId } },
            relations: ['grupo', 'grupo.programa', 'grupo.educador', 'grupo.educador.usuario'],
        });
    }

    async create(dto: CreateMatriculaDto) {
        const estudiante = await this.estudianteRepo.findOne({ where: { id: dto.estudianteId } });
        if (!estudiante) throw new NotFoundException(`Estudiante ${dto.estudianteId} no encontrado`);

        const grupo = await this.grupoRepo.findOne({
            where: { id: dto.grupoId },
            relations: ['matriculas'],
        });
        if (!grupo) throw new NotFoundException(`Grupo ${dto.grupoId} no encontrado`);

        // Verificar cupo disponible
        const matriculasActivas = grupo.matriculas.filter(m => m.estado === EstadoMatricula.ACTIVA);
        if (matriculasActivas.length >= grupo.cupoMaximo) {
            throw new BadRequestException('El grupo no tiene cupo disponible');
        }

        // Verificar que no esté ya matriculado
        const existe = await this.repo.findOne({
            where: { estudiante: { id: dto.estudianteId }, grupo: { id: dto.grupoId } },
        });
        if (existe) throw new ConflictException('El estudiante ya está matriculado en este grupo');

        const matricula = this.repo.create({
            estudiante,
            grupo,
            estado: dto.estado ?? EstadoMatricula.ACTIVA,
            fecha: new Date(),
        });
        return this.repo.save(matricula);
    }

    async update(id: string, dto: UpdateMatriculaDto) {
        const matricula = await this.findOne(id);
        matricula.estado = dto.estado;
        return this.repo.save(matricula);
    }

    async remove(id: string) {
        const matricula = await this.findOne(id);
        await this.repo.remove(matricula);
        return { message: `Matrícula ${id} eliminada` };
    }
}