import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Estudiante } from './estudiante.entity';
import { Grupo } from './grupo.entity';

@Entity('asistencia')
export class Asistencia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ default: false })
  presente: boolean;

  @ManyToOne(() => Estudiante, (e) => e.asistencias, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'estudiante_id' })
  estudiante: Estudiante;

  @ManyToOne(() => Grupo, (g) => g.asistencias, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'grupo_id' })
  grupo: Grupo;
}
