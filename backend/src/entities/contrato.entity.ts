import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Estudiante } from './estudiante.entity';
import { Pago } from './pago.entity';

@Entity('contrato')
export class Contrato {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  valor: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  monto: number;

  @Column({ name: 'fecha_inicio', type: 'date' })
  fechaInicio: Date;

  @Column({ name: 'fecha_fin', type: 'date' })
  fechaFin: Date;

  @ManyToOne(() => Estudiante, (e) => e.contratos, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'estudiante_id' })
  estudiante: Estudiante;

  @OneToMany(() => Pago, (p) => p.contrato)
  pagos: Pago[];
}
