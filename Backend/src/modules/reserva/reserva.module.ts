import { Module } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { ReservaController } from './reserva.controller';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Equipamiento } from '../equipamento/entities/equipamento.entity';
import { Cancha } from '../cancha/entities/cancha.entity';
import { Boleta } from '../boletas/entities/boleta.entity';
import { BoletaEquipamiento } from '../boletaequipamento/entities/boletaequipamento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva,Usuario,Equipamiento,Cancha,Boleta,BoletaEquipamiento])],
  controllers: [ReservaController],
  providers: [ReservaService],
  exports: [ReservaService,TypeOrmModule], // Export the service to be used in other modules
})
export class ReservaModule {}
