import { Inject, Injectable } from '@nestjs/common';
import { CreateBoletaequipamentoDto } from './dto/create-boletaequipamento.dto';
import { UpdateBoletaequipamentoDto } from './dto/update-boletaequipamento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BoletaEquipamiento } from './entities/boletaequipamento.entity';
import { Repository } from 'typeorm';
import { Boleta } from '../boletas/entities/boleta.entity';
import { Equipamiento } from '../equipamento/entities/equipamento.entity';
import { Reserva } from '../reserva/entities/reserva.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
@Injectable()
export class BoletaequipamentoService {
  constructor(
    @InjectRepository(BoletaEquipamiento)
    private readonly boletaEquipamientoRepository: Repository<BoletaEquipamiento>,
    @InjectRepository(Boleta)
    private readonly boletaRepository: Repository<Boleta>,
    @InjectRepository(Equipamiento)
    private readonly equipamientoRepository: Repository<Equipamiento>,
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}
  create(createBoletaequipamentoDto: CreateBoletaequipamentoDto) {
    return 'This action adds a new boletaequipamento';
  }

  findAll() {
    return `This action returns all boletaequipamento`;
  }

  findOne(id: number) {
    return `This action returns a #${id} boletaequipamento`;
  }

  update(id: number, updateBoletaequipamentoDto: UpdateBoletaequipamentoDto) {
    return `This action updates a #${id} boletaequipamento`;
  }

  remove(id: number) {
    return `This action removes a #${id} boletaequipamento`;
  }
  async calcularTotalBoleta(numeroBoleta: number): Promise<number> {
  const boleta = await this.boletaRepository.findOneBy({ numero_boleta: numeroBoleta });
  if (!boleta) {
    throw new Error('Boleta no encontrada');
  }

  const relaciones = await this.boletaEquipamientoRepository.find({
    where: { boleta: { numero_boleta: numeroBoleta } },
    relations: ['equipamiento'],
  });

  let total = 0;
  for (const relacion of relaciones) {
    if (!relacion.equipamiento || typeof relacion.equipamiento.costo !== 'number') {
      throw new Error('Equipamiento inválido o sin costo definido');
    }
    total += relacion.equipamiento.costo * relacion.cantidad;
  }

  return total;
}
async agregarEquipamientoABoleta(dto: { numero_boleta: number, nombre_equipamiento: string, cantidad: number }) {
  const boleta = await this.boletaRepository.findOneBy({ numero_boleta: dto.numero_boleta });
  if (!boleta) {
    throw new Error('Boleta no encontrada');
  }

  const equipamiento = await this.equipamientoRepository.findOneBy({ nombre: dto.nombre_equipamiento });
  if (!equipamiento) {
    throw new Error('Equipamiento no encontrado');
  }
  if (equipamiento.stock < dto.cantidad) {
    throw new Error(`Cantidad solicitada (${dto.cantidad}) supera la cantidad disponible (${equipamiento.stock})`);
  }
  const reserva = await this.reservaRepository.findOne({
    where: { boletaEquipamiento: { numero_boleta: dto.numero_boleta } },
    relations: ['cliente'],
  });

  if (!reserva || !reserva.cliente) {
    throw new Error('Reserva o cliente no encontrado');
  }
  const cliente = reserva.cliente;
  const costoTotal = equipamiento.costo * dto.cantidad;
  if (cliente.saldo < costoTotal) {
     throw new Error(`Saldo insuficiente. El costo es $${costoTotal}, pero tienes $${cliente.saldo}`);
  }
  cliente.saldo -= costoTotal;
  await this.usuarioRepository.save(cliente);


  const relacion = this.boletaEquipamientoRepository.create({
    boleta,
    equipamiento,
    cantidad: dto.cantidad,
  });

  return await this.boletaEquipamientoRepository.save(relacion);
}
}
