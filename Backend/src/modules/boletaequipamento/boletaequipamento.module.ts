import { Module } from '@nestjs/common';
import { BoletaequipamentoService } from './boletaequipamento.service';
import { BoletaequipamentoController } from './boletaequipamento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoletaEquipamiento } from './entities/boletaequipamento.entity';
import { BoletasModule } from '../boletas/boletas.module';
import { EquipamentoModule } from '../equipamento/equipamento.module';
import { ReservaModule } from '../reserva/reserva.module';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [TypeOrmModule.forFeature([BoletaEquipamiento]),
  BoletasModule, EquipamentoModule,ReservaModule,UsuariosModule], // Add the entities you want to use with TypeORM here
  controllers: [BoletaequipamentoController],
  providers: [BoletaequipamentoService],
})
export class BoletaequipamentoModule {}
