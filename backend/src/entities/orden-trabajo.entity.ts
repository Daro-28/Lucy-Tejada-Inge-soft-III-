import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Administrador } from './administrador.entity';
import { Mantenimiento } from './mantenimiento.entity';
import { Inventario } from './inventario.entity';

@Entity('orden_trabajo')
export class OrdenTrabajo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  estado: string;

  @Column({ type: 'date' })
  fecha: Date;

  @ManyToOne(() => Administrador, (a) => a.ordenesTrabajo, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'administrador_id' })
  administrador: Administrador;

  @ManyToOne(() => Mantenimiento, (m) => m.ordenesTrabajo, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'mantenimiento_id' })
  mantenimiento: Mantenimiento;

  @OneToMany(() => Inventario, (i) => i.ordenTrabajo)
  inventarios: Inventario[];
}
