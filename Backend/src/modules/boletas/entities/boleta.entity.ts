
import { BoletaJugadores } from 'src/modules/boleta-jugadores/entities/boleta-jugadore.entity';
import { BoletaEquipamiento } from 'src/modules/boletaequipamento/entities/boletaequipamento.entity';
import { Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';


@Entity()
export class Boleta {
  @PrimaryGeneratedColumn()
  numero_boleta: number;

  @OneToMany(() => BoletaEquipamiento, (relacion) => relacion.boleta)
  relaciones: BoletaEquipamiento[];
   @OneToMany(() => BoletaJugadores, (jugador) => jugador.boleta)
  jugadores: BoletaJugadores[];
}