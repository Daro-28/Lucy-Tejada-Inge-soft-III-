import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Educador } from './educador.entity';
import { Programa } from './programa.entity';
import { Matricula } from './matricula.entity';
import { Asistencia } from './asistencia.entity';
import { Evaluacion } from './evaluacion.entity';

@Entity('grupo')
export class Grupo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  nombre: string;

  @Column({ nullable: true, length: 255 })
  horario: string;

  @Column({ name: 'cupo_maximo' })
  cupoMaximo: number;

  @ManyToOne(() => Educador, (e) => e.grupos, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'educador_id' })
  educador: Educador;

  @ManyToOne(() => Programa, (p) => p.grupos, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'programa_id' })
  programa: Programa;

  @OneToMany(() => Matricula, (m) => m.grupo)
  matriculas: Matricula[];

  @OneToMany(() => Asistencia, (a) => a.grupo)
  asistencias: Asistencia[];

  @OneToMany(() => Evaluacion, (e) => e.grupo)
  evaluaciones: Evaluacion[];
}
