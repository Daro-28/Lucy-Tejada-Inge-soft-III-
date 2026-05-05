import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { Matricula } from './matricula.entity';
import { Asistencia } from './asistencia.entity';
import { Evaluacion } from './evaluacion.entity';
import { Contrato } from './contrato.entity';

@Entity('estudiante')
export class Estudiante {
  @PrimaryColumn('uuid')
  id: string;

  @OneToOne(() => Usuario, (u) => u.estudiante, { eager: true })
  @JoinColumn({ name: 'id' })
  usuario: Usuario;

  @Column({ nullable: true, length: 100 })
  codigo: string;

  @Column({ name: 'fecha_registro', type: 'date', default: () => 'CURRENT_DATE' })
  fechaRegistro: Date;

  @OneToMany(() => Matricula, (m) => m.estudiante)
  matriculas: Matricula[];

  @OneToMany(() => Asistencia, (a) => a.estudiante)
  asistencias: Asistencia[];

  @OneToMany(() => Evaluacion, (e) => e.estudiante)
  evaluaciones: Evaluacion[];

  @OneToMany(() => Contrato, (c) => c.estudiante)
  contratos: Contrato[];
}
