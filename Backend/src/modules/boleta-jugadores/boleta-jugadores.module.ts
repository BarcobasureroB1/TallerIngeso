import { Module } from '@nestjs/common';
import { BoletaJugadoresService } from './boleta-jugadores.service';
import { BoletaJugadoresController } from './boleta-jugadores.controller';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoletaJugadores } from './entities/boleta-jugadore.entity';
import { Boleta } from '../boletas/entities/boleta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoletaJugadores,Boleta])], // Replace 'Type' with the actual entity class for BoletaJugadores
  controllers: [BoletaJugadoresController],
  providers: [BoletaJugadoresService],
  exports: [BoletaJugadoresService,TypeOrmModule], // Export the service if you want to use it in other modules
})
export class BoletaJugadoresModule {}
