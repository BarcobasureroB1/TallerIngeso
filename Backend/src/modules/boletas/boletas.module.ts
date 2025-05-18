import { Module } from '@nestjs/common';
import { BoletasService } from './boletas.service';
import { BoletasController } from './boletas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boleta } from './entities/boleta.entity'; // Import the Boleta entity

@Module({
  imports: [TypeOrmModule.forFeature([Boleta])], // Import TypeOrmModule with Boleta entity
  controllers: [BoletasController],
  providers: [BoletasService],
})
export class BoletasModule {}
