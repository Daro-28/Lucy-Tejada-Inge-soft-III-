import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { TipoMantenimiento } from './enums';
import { Escenario } from './escenario.entity';
import { OrdenTrabajo } from './orden-trabajo.entity';

@Entity('mantenimiento')
export class Mantenimiento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: TipoMantenimiento })
  tipo: TipoMantenimiento;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @ManyToOne(() => Escenario, (e) => e.mantenimientos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'escenario_id' })
  escenario: Escenario;

  @OneToMany(() => OrdenTrabajo, (o) => o.mantenimiento)
  ordenesTrabajo: OrdenTrabajo[];
}
