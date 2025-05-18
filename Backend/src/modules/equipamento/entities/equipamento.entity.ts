
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Equipamiento {
  @PrimaryColumn()
  nombre: string;

  @Column('int')
  stock: number;

  @Column()
  tipo: string;

  @Column('float')
  costo: number;
}