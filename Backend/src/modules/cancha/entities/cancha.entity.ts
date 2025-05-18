import { Reserva } from 'src/modules/reserva/entities/reserva.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
//import { Reserva } from 'src/modules/reservas/entities/reserva.entity';

@Entity()
export class Cancha {
  @PrimaryGeneratedColumn()
  id_cancha: number;

  @Column('float')
  costo: number;

  @OneToMany(() => Reserva, (reserva) => reserva.cancha)
  reservas: Reserva[];
}

