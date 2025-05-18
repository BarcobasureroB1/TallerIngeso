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
  const boleta = await this.boletaRepository.findOneBy({ numero_boleta: dto.boleta_equipamiento });

  if (!cliente || !cancha) {
    throw new Error('Cliente o cancha no encontrados');
  }
  if (!boleta) {
  throw new Error('Boleta no encontrada');
}

  const reserva = new Reserva();
  reserva.cliente = cliente;
  reserva.fecha = dto.fecha;
  reserva.hora_inicio = dto.hora_inicio;
  reserva.hora_fin = dto.hora_fin;
  reserva.cancha = cancha;
  reserva.equipamiento = dto.equipamiento;
  reserva.boletaEquipamiento = boleta;

  return await this.reservaRepository.save(reserva);
}

  async findAll() {
    return await this.reservaRepository.find();
  }

  async findOne(id: number) {
    return await this.reservaRepository.findOneBy({ id_reserva: id });
  }

  update(id: number, updateReservaDto: UpdateReservaDto) {
    return `This action updates a #${id} reserva`;
  }

  remove(id: number) {
    return `This action removes a #${id} reserva`;
  }
}
