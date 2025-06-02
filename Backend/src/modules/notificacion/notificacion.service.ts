import { Injectable } from '@nestjs/common';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
import { UpdateNotificacionDto } from './dto/update-notificacion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notificacion } from './entities/notificacion.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
@Injectable()
export class NotificacionService {
  constructor(
    @InjectRepository(Notificacion)
    private readonly notificacionRepository: Repository<Notificacion>,
    @InjectRepository(Usuario) 
    private readonly usuarioRepository: Repository<Usuario>, 
  ) {}
  async createnoti(rut: string, mensaje: string): Promise<Notificacion> {
  const usuario = await this.usuarioRepository.findOneBy({ rut: rut });

  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }

  const notificacion = this.notificacionRepository.create({
    
    usuario: usuario, 
    mensaje: mensaje,
    fechaHora: new Date(), // Establece la fecha y hora actual
  });

  return this.notificacionRepository.save(notificacion);
}

  async findAll() {
    
    return await this.notificacionRepository.find({
      relations: ['usuario'],
    });;
  }

  async findOne(id: string) {
    const cliente = await this.usuarioRepository.findOneBy({ rut: id });
    if (!cliente) {
      throw new Error('Usuario no encontrado');
    }
   return await this.notificacionRepository.find(
      {
        where: { usuario: cliente },
        relations: ['usuario'],
        order : { fechaHora: 'DESC' }, 
      }
      
    );
    
    
  }

  update(id: number, updateNotificacionDto: UpdateNotificacionDto) {
    return `This action updates a #${id} notificacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} notificacion`;
  }
}
