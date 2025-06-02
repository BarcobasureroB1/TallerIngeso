import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Boleta } from 'src/modules/boletas/entities/boleta.entity';
import { Equipamiento } from 'src/modules/equipamento/entities/equipamento.entity';

@Entity()
export class BoletaEquipamiento {
  @PrimaryGeneratedColumn()
  id_relacion: number;

  @ManyToOne(() => Boleta, (boleta) => boleta.relaciones)
  @JoinColumn({ name: 'numero_boleta' })
  boleta: Boleta;

  @ManyToOne(() => Equipamiento)
  @JoinColumn({ name: 'nombre_equipamiento' })
  equipamiento: Equipamiento;

  @Column()
  cantidad: number;
  @Column ( {default: false} )
  eliminado: boolean;
}