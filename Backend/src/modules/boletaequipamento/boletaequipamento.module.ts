import { Module } from '@nestjs/common';
import { BoletaequipamentoService } from './boletaequipamento.service';
import { BoletaequipamentoController } from './boletaequipamento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoletaEquipamiento } from './entities/boletaequipamento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoletaEquipamiento])], // Add the entities you want to use with TypeORM here
  controllers: [BoletaequipamentoController],
  providers: [BoletaequipamentoService],
})
export class BoletaequipamentoModule {}
