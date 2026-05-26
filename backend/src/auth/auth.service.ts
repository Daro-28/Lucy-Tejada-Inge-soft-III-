import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Usuario } from '../entities/usuario.entity';
import { Estudiante } from '../entities/estudiante.entity';
import { Educador } from '../entities/educador.entity';
import { Administrador } from '../entities/administrador.entity';
import { Rol } from '../entities/enums';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,

    @InjectRepository(Estudiante)
    private estudianteRepo: Repository<Estudiante>,

    @InjectRepository(Educador)
    private educadorRepo: Repository<Educador>,

    @InjectRepository(Administrador)
    private administradorRepo: Repository<Administrador>,

    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Verificar si el email ya existe
    const existe = await this.usuarioRepo.findOne({ where: { email: dto.email } });
    if (existe) throw new ConflictException('El email ya está registrado');

    // Hash de la contraseña
    const hash = await bcrypt.hash(dto.password, 10);

    // Crear usuario base
    const usuario = this.usuarioRepo.create({
      nombre: dto.nombre,
      email: dto.email,
      password: hash,
      rol: dto.rol,
    });
    const savedUsuario = await this.usuarioRepo.save(usuario);

    // Crear subtabla según rol
    if (dto.rol === Rol.ESTUDIANTE) {
      await this.estudianteRepo.save({
        id: savedUsuario.id,
        codigo: dto.codigo ?? undefined,
        fechaRegistro: new Date(),
      });
    } else if (dto.rol === Rol.EDUCADOR) {
      await this.educadorRepo.save({
        id: savedUsuario.id,
        especialidad: dto.especialidad ?? undefined
      });
    } else if (dto.rol === Rol.ADMIN) {
      await this.administradorRepo.save({ id: savedUsuario.id });
    }

    const { password, ...result } = savedUsuario;
    return { message: 'Usuario registrado exitosamente', usuario: result };
  }

  async login(dto: LoginDto) {
    const usuario = await this.usuarioRepo.findOne({
      where: { email: dto.email },
      select: ['id', 'nombre', 'email', 'password', 'rol', 'activo'],
    });
    if (!usuario) throw new UnauthorizedException('Credenciales inválidas');

    if (!usuario.activo) throw new UnauthorizedException('Usuario inactivo');

    const passwordValido = await bcrypt.compare(dto.password, usuario.password);
    if (!passwordValido) throw new UnauthorizedException('Credenciales inválidas');

    const payload = { sub: usuario.id, email: usuario.email, rol: usuario.rol };
    const token = this.jwtService.sign(payload);

    const { password, ...datosUsuario } = usuario;
    return { access_token: token, usuario: datosUsuario };
  }

  async validateUser(id: string): Promise<Usuario | null> {
    return this.usuarioRepo.findOne({ where: { id, activo: true } });
  }
}