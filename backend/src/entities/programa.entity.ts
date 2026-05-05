import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Grupo } from './grupo.entity';

@Entity('programa')
export class Programa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @OneToMany(() => Grupo, (g) => g.programa)
  grupos: Grupo[];
}
