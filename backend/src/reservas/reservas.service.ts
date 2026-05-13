import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from '../entities/reserva.entity';
import { Usuario } from '../entities/usuario.entity';
import { Escenario } from '../entities/escenario.entity';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';

@Injectable()
export class ReservasService {
    constructor(
        @InjectRepository(Reserva) private readonly repo: Repository<Reserva>,
        @InjectRepository(Usuario) private readonly usuarioRepo: Repository<Usuario>,
        @InjectRepository(Escenario) private readonly escenarioRepo: Repository<Escenario>,
    ) { }

    findAll() {
        return this.repo.find({ relations: ['usuario', 'escenario'] });
    }

    async findOne(id: string) {
        const reserva = await this.repo.findOne({ where: { id }, relations: ['usuario', 'escenario'] });
        if (!reserva) throw new NotFoundException(`Reserva ${id} no encontrada`);
        return reserva;
    }

    async create(dto: CreateReservaDto) {
        const usuario = await this.usuarioRepo.findOne({ where: { id: dto.usuarioId } });
        if (!usuario) throw new NotFoundException(`Usuario ${dto.usuarioId} no encontrado`);
        const escenario = await this.escenarioRepo.findOne({ where: { id: dto.escenarioId } });
        if (!escenario) throw new NotFoundException(`Escenario ${dto.escenarioId} no encontrado`);

        // Verificar conflicto de horario
        const conflicto = await this.repo
            .createQueryBuilder('r')
            .where('r.escenario_id = :escenarioId', { escenarioId: dto.escenarioId })
            .andWhere('r.fecha = :fecha', { fecha: dto.fecha })
            .andWhere('r.hora_inicio < :horaFin AND r.hora_fin > :horaInicio', {
                horaFin: dto.horaFin,
                horaInicio: dto.horaInicio,
            })
            .getOne();
        if (conflicto) throw new ConflictException('El escenario ya está reservado en ese horario');

        const reserva = this.repo.create({
            usuario,
            escenario,
            fecha: new Date(dto.fecha),
            horaInicio: dto.horaInicio,
            horaFin: dto.horaFin,
        });
        return this.repo.save(reserva);
    }

    async update(id: string, dto: UpdateReservaDto) {
        const reserva = await this.findOne(id);
        const { usuarioId, escenarioId, ...rest } = dto;
        Object.assign(reserva, rest);
        return this.repo.save(reserva);
    }

    async remove(id: string) {
        const reserva = await this.findOne(id);
        await this.repo.remove(reserva);
        return { message: `Reserva ${id} eliminada` };
    }
}