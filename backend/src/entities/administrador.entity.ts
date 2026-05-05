import {
  Entity,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { OrdenTrabajo } from './orden-trabajo.entity';
import { Reporte } from './reporte.entity';

@Entity('administrador')
export class Administrador {
  @PrimaryColumn('uuid')
  id: string;

  @OneToOne(() => Usuario, (u) => u.administrador, { eager: true })
  @JoinColumn({ name: 'id' })
  usuario: Usuario;

  @OneToMany(() => OrdenTrabajo, (o) => o.administrador)
  ordenesTrabajo: OrdenTrabajo[];

  @OneToMany(() => Reporte, (r) => r.administrador)
  reportes: Reporte[];
}
