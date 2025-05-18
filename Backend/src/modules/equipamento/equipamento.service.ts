import { Injectable } from '@nestjs/common';
import { CreateEquipamentoDto } from './dto/create-equipamento.dto';
import { UpdateEquipamentoDto } from './dto/update-equipamento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Equipamiento } from './entities/equipamento.entity';
import { Repository } from 'typeorm';
import { AñadirStockDto } from './dto/añadir-stock.dto';

@Injectable()
export class EquipamentoService {
  constructor(
    @InjectRepository(Equipamiento)
    private readonly equipamentoRepository: Repository<Equipamiento>,
  ) {}
  async create(createEquipamentoDto: CreateEquipamentoDto) {
    return await this.equipamentoRepository.save(createEquipamentoDto);
  }

  async findAll() {
    return await this.equipamentoRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} equipamento`;
  }

  update(id: number, updateEquipamentoDto: UpdateEquipamentoDto) {
    return `This action updates a #${id} equipamento`;
  }

  remove(id: number) {
    return `This action removes a #${id} equipamento`;
  }
  async anadirStock(añadirStockDto: AñadirStockDto) {
    const equipamento = await this.equipamentoRepository.findOneBy({
      nombre: añadirStockDto.nombre,
    });
    if (!equipamento) {
      throw new Error('Equipamiento no encontrado');
    }
    equipamento.stock += añadirStockDto.stock;
    return await this.equipamentoRepository.save(equipamento);
  }
}
