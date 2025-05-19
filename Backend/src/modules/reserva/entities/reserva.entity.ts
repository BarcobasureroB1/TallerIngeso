import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from 'src/modules/usuarios/entities/usuario.entity';
import { Boleta } from 'src/modules/boletas/entities/boleta.entity';
import { Cancha } from 'src/modules/cancha/entities/cancha.entity';

@Entity()
export class Reserva {
  @PrimaryGeneratedColumn()
  id_reserva: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.reservas)
  @JoinColumn({ name: 'rut_cliente' })
  cliente: Usuario;

  @Column({ type: 'date' })
  fecha: string;

  @Column()
  hora_inicio: string;

  @Column()
  hora_fin: string;

  @ManyToOne(() => Cancha, (cancha) => cancha.reservas)
  @JoinColumn({ name: 'id_cancha' })
  cancha: Cancha;

  @Column({ default: false })
  equipamiento: boolean;

  @ManyToOne(() => Boleta, { nullable: true })
  @JoinColumn({ name: 'boleta_equipamiento' })
  boletaEquipamiento: Boleta | null;
  
}