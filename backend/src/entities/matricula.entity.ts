import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { EstadoMatricula } from './enums';
import { Estudiante } from './estudiante.entity';
import { Grupo } from './grupo.entity';

@Entity('matricula')
@Unique(['estudiante', 'grupo'])
export class Matricula {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fecha: Date;

  @Column({ type: 'enum', enum: EstadoMatricula, default: EstadoMatricula.ACTIVA })
  estado: EstadoMatricula;

  @ManyToOne(() => Estudiante, (e) => e.matriculas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'estudiante_id' })
  estudiante: Estudiante;

  @ManyToOne(() => Grupo, (g) => g.matriculas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'grupo_id' })
  grupo: Grupo;
}
