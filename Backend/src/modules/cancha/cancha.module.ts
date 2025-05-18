import { Module } from '@nestjs/common';
import { CanchaService } from './cancha.service';
import { CanchaController } from './cancha.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cancha } from './entities/cancha.entity'; // Import the Cancha entity

@Module({
  imports: [TypeOrmModule.forFeature([Cancha])], // Import TypeOrmModule with Cancha entity
  controllers: [CanchaController],
  providers: [CanchaService],
})
export class CanchaModule {}
