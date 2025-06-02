import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Boleta } from 'src/modules/boletas/entities/boleta.entity';

@Entity()
export class BoletaJugadores {
  @PrimaryGeneratedColumn()
  id_relacion: number;

  @ManyToOne(() => Boleta, (boleta) => boleta.jugadores)
  @JoinColumn({ name: 'numero_boleta' })
  boleta: Boleta;

  @Column()
  nombres_jugador: string;

  @Column()
  apellidos_jugador: string;
  @Column()
  rut_jugador: string;
  @Column()
  edad_jugador: number;
  
}