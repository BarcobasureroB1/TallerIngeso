import { Module } from '@nestjs/common';
import { BoletasService } from './boletas.service';
import { BoletasController } from './boletas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boleta } from './entities/boleta.entity'; // Import the Boleta entity
import { Type } from 'class-transformer';

@Module({
  imports: [TypeOrmModule.forFeature([Boleta])], // Import TypeOrmModule with Boleta entity
  controllers: [BoletasController],
  providers: [BoletasService],
  exports: [BoletasService,TypeOrmModule], // Export the service to be used in other modules
})
export class BoletasModule {}
