import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Reporte } from './reporte.entity';

@Entity('archivo')
export class Archivo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  url: string;

  @Column({ length: 100 })
  tipo: string;

  @OneToMany(() => Reporte, (r) => r.archivo)
  reportes: Reporte[];
}
