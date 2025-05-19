import { Module } from '@nestjs/common';
import { EquipamentoService } from './equipamento.service';
import { EquipamentoController } from './equipamento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipamiento } from './entities/equipamento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Equipamiento])], // Add the entities you want to use with TypeORM here
  controllers: [EquipamentoController],
  providers: [EquipamentoService],
  exports: [EquipamentoService, TypeOrmModule], // Export the service to be used in other modules
})
export class EquipamentoModule {}
