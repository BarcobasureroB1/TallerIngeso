import { Reserva } from 'src/modules/reserva/entities/reserva.entity';
import { Notificacion } from 'src/modules/notificacion/entities/notificacion.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity()
export class Usuario {
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

    @Column({ default: null, nullable: true })
    nombre: string;

    @OneToMany(() => Reserva, (reserva) => reserva.cliente)
    reservas: Reserva[];

    @OneToMany(() => Notificacion, (notificacion) => notificacion.usuario)
    notificaciones: Notificacion[];
}
