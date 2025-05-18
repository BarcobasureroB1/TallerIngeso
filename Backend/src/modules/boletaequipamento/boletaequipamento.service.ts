import { Injectable } from '@nestjs/common';
import { CreateBoletaequipamentoDto } from './dto/create-boletaequipamento.dto';
import { UpdateBoletaequipamentoDto } from './dto/update-boletaequipamento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BoletaEquipamiento } from './entities/boletaequipamento.entity';
import { Repository } from 'typeorm';
@Injectable()
export class BoletaequipamentoService {
  constructor(
    @InjectRepository(BoletaEquipamiento)
    private readonly boletaEquipamientoRepository: Repository<BoletaEquipamiento>,
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
  const relaciones = await this.boletaEquipamientoRepository.find({
    where: { boleta: { numero_boleta: numeroBoleta } },
    relations: ['equipamiento'],
  });

  let total = 0;
  for (const relacion of relaciones) {
    total += relacion.equipamiento.costo * relacion.cantidad;
  }

  return total;
}
}
