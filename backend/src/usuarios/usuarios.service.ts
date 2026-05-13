import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(Usuario)
        private readonly repo: Repository<Usuario>,
    ) { }

    async findAll(): Promise<Omit<Usuario, 'password'>[]> {
        const usuarios = await this.repo.find();
        return usuarios.map(({ password, ...u }) => u as Omit<Usuario, 'password'>);
    }

    async findOne(id: string): Promise<Omit<Usuario, 'password'>> {
        const usuario = await this.repo.findOne({ where: { id } });
        if (!usuario) throw new NotFoundException(`Usuario ${id} no encontrado`);
        const { password, ...result } = usuario;
        return result as Omit<Usuario, 'password'>;
    }

    async create(dto: CreateUsuarioDto): Promise<Omit<Usuario, 'password'>> {
        const existe = await this.repo.findOne({ where: { email: dto.email } });
        if (existe) throw new ConflictException('El email ya está registrado');

        const hash = await bcrypt.hash(dto.password, 10);
        const usuario = this.repo.create({ ...dto, password: hash });
        const saved = await this.repo.save(usuario);
        const { password, ...result } = saved;
        return result as Omit<Usuario, 'password'>;
    }

    async update(id: string, dto: UpdateUsuarioDto): Promise<Omit<Usuario, 'password'>> {
        const usuario = await this.repo.findOne({ where: { id } });
        if (!usuario) throw new NotFoundException(`Usuario ${id} no encontrado`);

        if (dto.email && dto.email !== usuario.email) {
            const existe = await this.repo.findOne({ where: { email: dto.email } });
            if (existe) throw new ConflictException('El email ya está en uso');
        }

        if (dto.password) {
            dto.password = await bcrypt.hash(dto.password, 10);
        }

        Object.assign(usuario, dto);
        const saved = await this.repo.save(usuario);
        const { password, ...result } = saved;
        return result as Omit<Usuario, 'password'>;
    }

    async remove(id: string): Promise<{ message: string }> {
        const usuario = await this.repo.findOne({ where: { id } });
        if (!usuario) throw new NotFoundException(`Usuario ${id} no encontrado`);
        await this.repo.remove(usuario);
        return { message: `Usuario ${id} eliminado correctamente` };
    }
}