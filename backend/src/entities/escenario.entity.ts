import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { EstadoEscenario } from './enums';
import { Reserva } from './reserva.entity';
import { Mantenimiento } from './mantenimiento.entity';

@Entity('escenario')
export class Escenario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  nombre: string;

  @Column()
  capacidad: number;

  @Column({ type: 'enum', enum: EstadoEscenario, default: EstadoEscenario.DISPONIBLE })
  estado: EstadoEscenario;

  @OneToMany(() => Reserva, (r) => r.escenario)
  reservas: Reserva[];

  @OneToMany(() => Mantenimiento, (m) => m.escenario)
  mantenimientos: Mantenimiento[];
}
