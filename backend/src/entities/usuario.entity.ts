import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Rol } from './enums';
import { Estudiante } from './estudiante.entity';
import { Educador } from './educador.entity';
import { Administrador } from './administrador.entity';
import { Reserva } from './reserva.entity';
import { Notificacion } from './notificacion.entity';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  nombre: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 255, select: false })
  password: string;

  @Column({ type: 'enum', enum: Rol })
  rol: Rol;

  @Column({ default: true })
  activo: boolean;

  @OneToOne(() => Estudiante, (e) => e.usuario)
  estudiante: Estudiante;

  @OneToOne(() => Educador, (e) => e.usuario)
  educador: Educador;

  @OneToOne(() => Administrador, (a) => a.usuario)
  administrador: Administrador;

  @OneToMany(() => Reserva, (r) => r.usuario)
  reservas: Reserva[];

  @OneToMany(() => Notificacion, (n) => n.usuario)
  notificaciones: Notificacion[];
}
