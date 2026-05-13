import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from '../entities/estudiante.entity';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';

@Injectable()
export class EstudiantesService {
    constructor(
        @InjectRepository(Estudiante)
        private readonly repo: Repository<Estudiante>,
    ) { }

    findAll() {
        return this.repo.find({ relations: ['usuario', 'matriculas'] });
    }

    async findOne(id: string) {
        const estudiante = await this.repo.findOne({
            where: { id },
            relations: ['usuario', 'matriculas', 'matriculas.grupo'],
        });
        if (!estudiante) throw new NotFoundException(`Estudiante ${id} no encontrado`);
        return estudiante;
    }

    async create(dto: CreateEstudianteDto) {
        const estudiante = this.repo.create({
            id: dto.usuarioId,
            codigo: dto.codigo,
            fechaRegistro: new Date(),
        });
        return this.repo.save(estudiante);
    }

    async update(id: string, dto: UpdateEstudianteDto) {
        const estudiante = await this.findOne(id);
        if (dto.codigo) estudiante.codigo = dto.codigo;
        return this.repo.save(estudiante);
    }

    async remove(id: string) {
        const estudiante = await this.findOne(id);
        await this.repo.remove(estudiante);
        return { message: `Estudiante ${id} eliminado` };
    }
}
