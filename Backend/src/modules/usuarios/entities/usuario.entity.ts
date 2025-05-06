import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
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

}


