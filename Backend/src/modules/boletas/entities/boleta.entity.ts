
import { BoletaEquipamiento } from 'src/modules/boletaequipamento/entities/boletaequipamento.entity';
import { Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';


@Entity()
export class Boleta {
  @PrimaryGeneratedColumn()
  numero_boleta: number;

  @OneToMany(() => BoletaEquipamiento, (relacion) => relacion.boleta)
  relaciones: BoletaEquipamiento[];
}