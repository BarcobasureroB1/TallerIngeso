import { Injectable } from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity';
import { Repository } from 'typeorm';
import { Cancha } from '../cancha/entities/cancha.entity';
import { Equipamiento } from '../equipamento/entities/equipamento.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Boleta } from '../boletas/entities/boleta.entity';
import { ReservaResponseDto } from './dto/reserva-response.dto';

@Injectable()
export class ReservaService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Equipamiento)
    private readonly equipamientoRepository: Repository<Equipamiento>,
    @InjectRepository(Cancha)
    private readonly canchaRepository: Repository<Cancha>,
    @InjectRepository(Boleta)
    private readonly boletaRepository: Repository<Boleta>,
  ) {}
 async crearReserva(dto: CreateReservaDto) {
  const cliente = await this.usuarioRepository.findOneBy({ rut: dto.rut_cliente });
  const cancha = await this.canchaRepository.findOneBy({ id_cancha: dto.id_cancha });
  
  if (!cliente) {
    throw new Error('Cliente no encontrado');
  }
  if (!cancha) {
    throw new Error('Cancha no encontrada');
  }
  
  const boleta = this.boletaRepository.create()
  await this.boletaRepository.save(boleta);
  

  const reserva = this.reservaRepository.create({
    cliente,
    fecha: dto.fecha,
    hora_inicio: dto.hora_inicio,
    hora_fin: dto.hora_fin,
    cancha,
    equipamiento: dto.equipamiento,
    boletaEquipamiento: boleta,
  });

  return await this.reservaRepository.save(reserva);
}
async findAll() {
  const reservas = await this.reservaRepository.find({
    where: { cancelado: false },
    relations: [
    'cliente',
    'cancha',
    'boletaEquipamiento',
    'boletaEquipamiento.relaciones',
    'boletaEquipamiento.relaciones.equipamiento',
    ],
  });

  return reservas.map((reserva) => ({
    id_reserva: reserva.id_reserva,
    fecha: reserva.fecha,
    hora_inicio: reserva.hora_inicio,
    hora_fin: reserva.hora_fin,
    cliente: {
      rut: reserva.cliente.rut,
      correo: reserva.cliente.correo,
    },
    cancha: {
      id_cancha: reserva.cancha.id_cancha,
      costo: reserva.cancha.costo,
    },
    equipamientoAsignado: reserva.boletaEquipamiento?.relaciones?.map(be => ({
      nombre: be.equipamiento.nombre,
      cantidad: be.cantidad,
    })) || [],
  }));
}

  async findOne(id: number) {
    return await this.reservaRepository.findBy({ id_reserva: id });
  }

  update(id: number, updateReservaDto: UpdateReservaDto) {
    return `This action updates a #${id} reserva`;
  }

  remove(id: number) {
    return `This action removes a #${id} reserva`;
  }
  async cancelar(id: number) {
  const reserva = await this.reservaRepository.findOneBy({ id_reserva: id });
  if (!reserva) {
    throw new Error('Reserva no encontrada');
  }

  reserva.cancelado = true;
  return await this.reservaRepository.save(reserva);
}

}
