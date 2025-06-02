import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';

import { ReservaModule } from './modules/reserva/reserva.module';
import { EquipamentoModule } from './modules/equipamento/equipamento.module';
import { Cancha } from './modules/cancha/entities/cancha.entity';
import { CanchaModule } from './modules/cancha/cancha.module';
import { BoletasModule } from './modules/boletas/boletas.module';
import { BoletaEquipamiento } from './modules/boletaequipamento/entities/boletaequipamento.entity';
import { BoletaequipamentoModule } from './modules/boletaequipamento/boletaequipamento.module';
import { NotificacionModule } from './modules/notificacion/notificacion.module';
import { BoletaJugadores } from './modules/boleta-jugadores/entities/boleta-jugadore.entity';
import { BoletaJugadoresModule } from './modules/boleta-jugadores/boleta-jugadores.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      synchronize: true,
      autoLoadEntities: true,
    }),
    UsuariosModule,AuthModule,ReservaModule,
    EquipamentoModule,CanchaModule,BoletasModule,
    BoletaequipamentoModule, NotificacionModule,
    BoletaJugadoresModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
