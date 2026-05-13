import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notificacion } from '../entities/notificacion.entity';
import { Usuario } from '../entities/usuario.entity';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
import { UpdateNotificacionDto } from './dto/update-notificacion.dto';

@Injectable()
export class NotificacionesService {
    constructor(
        @InjectRepository(Notificacion) private readonly repo: Repository<Notificacion>,
        @InjectRepository(Usuario) private readonly usuarioRepo: Repository<Usuario>,
    ) { }

    findAll() {
        return this.repo.find({ relations: ['usuario'] });
    }

    async findOne(id: string) {
        const notificacion = await this.repo.findOne({ where: { id }, relations: ['usuario'] });
        if (!notificacion) throw new NotFoundException(`Notificación ${id} no encontrada`);
        return notificacion;
    }

    findByUsuario(usuarioId: string) {
        return this.repo.find({
            where: { usuario: { id: usuarioId } },
            order: { fecha: 'DESC' },
        });
    }

    async create(dto: CreateNotificacionDto) {
        const usuario = await this.usuarioRepo.findOne({ where: { id: dto.usuarioId } });
        if (!usuario) throw new NotFoundException(`Usuario ${dto.usuarioId} no encontrado`);
        const notificacion = this.repo.create({ usuario, mensaje: dto.mensaje, fecha: new Date() });
        return this.repo.save(notificacion);
    }

    async update(id: string, dto: UpdateNotificacionDto) {
        const notificacion = await this.findOne(id);
        if (dto.mensaje) notificacion.mensaje = dto.mensaje;
        return this.repo.save(notificacion);
    }

    async remove(id: string) {
        const notificacion = await this.findOne(id);
        await this.repo.remove(notificacion);
        return { message: `Notificación ${id} eliminada` };
    }
}