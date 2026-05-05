import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { Grupo } from './grupo.entity';

@Entity('educador')
export class Educador {
  @PrimaryColumn('uuid')
  id: string;

  @OneToOne(() => Usuario, (u) => u.educador, { eager: true })
  @JoinColumn({ name: 'id' })
  usuario: Usuario;

  @Column({ nullable: true, length: 255 })
  especialidad: string;

  @OneToMany(() => Grupo, (g) => g.educador)
  grupos: Grupo[];
}
