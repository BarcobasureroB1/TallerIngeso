import { Reserva } from 'src/modules/reserva/entities/reserva.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
@Entity()
export class Usuario {
    //@PrimaryGeneratedColumn()
    @Column({ primary: true })
    rut: string;
    @Column({ unique: true })
    correo: string;
    @Column()
    password: string;
    @Column({ default: 0 })
    saldo: number;
    @Column({ default: false })
    admin: boolean;
    @OneToMany(() => Reserva, (reserva) => reserva.cliente)
    reservas: Reserva[];

}


