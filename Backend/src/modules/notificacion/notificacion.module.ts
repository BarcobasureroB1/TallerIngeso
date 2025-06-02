import { Module } from '@nestjs/common';
import { NotificacionService } from './notificacion.service';
import { NotificacionController } from './notificacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notificacion } from './entities/notificacion.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notificacion,Usuario])], // Add the entities you want to use with TypeORM here
  controllers: [NotificacionController],
  providers: [NotificacionService],
  exports: [NotificacionService, TypeOrmModule], // Export the service if you want to use it in other modules
})
export class NotificacionModule {}
