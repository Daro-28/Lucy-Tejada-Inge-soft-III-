import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrdenTrabajo } from './orden-trabajo.entity';

@Entity('inventario')
export class Inventario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  nombre: string;

  @Column({ default: 0 })
  cantidad: number;

  @ManyToOne(() => OrdenTrabajo, (o) => o.inventarios, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'orden_trabajo_id' })
  ordenTrabajo: OrdenTrabajo;
}
