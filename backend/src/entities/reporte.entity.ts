import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Administrador } from './administrador.entity';
import { Archivo } from './archivo.entity';

@Entity('reporte')
export class Reporte {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  tipo: string;

  @Column({ name: 'fecha_generacion', type: 'date', default: () => 'CURRENT_DATE' })
  fechaGeneracion: Date;

  @ManyToOne(() => Administrador, (a) => a.reportes, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'administrador_id' })
  administrador: Administrador;

  @ManyToOne(() => Archivo, (a) => a.reportes, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'archivo_id' })
  archivo: Archivo;
}
