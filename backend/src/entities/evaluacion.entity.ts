import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Estudiante } from './estudiante.entity';
import { Grupo } from './grupo.entity';

@Entity('evaluacion')
export class Evaluacion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'numeric', precision: 4, scale: 2, nullable: true })
  calificacion: number;

  @ManyToOne(() => Estudiante, (e) => e.evaluaciones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'estudiante_id' })
  estudiante: Estudiante;

  @ManyToOne(() => Grupo, (g) => g.evaluaciones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'grupo_id' })
  grupo: Grupo;
}
