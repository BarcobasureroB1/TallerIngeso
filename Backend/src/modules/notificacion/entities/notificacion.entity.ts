import { Usuario } from 'src/modules/usuarios/entities/usuario.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Notificacion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    mensaje: string;

    @Column({ name: 'fecha_hora' })
    fechaHora: Date;

    @ManyToOne(() => Usuario, (usuario) => usuario.notificaciones)
    @JoinColumn({ name: 'rut_usuario' }) // importante para reflejar FK en DB
    usuario: Usuario;
}
