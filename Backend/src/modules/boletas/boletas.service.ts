import { Injectable } from '@nestjs/common';
import { CreateBoletaDto } from './dto/create-boleta.dto';
import { UpdateBoletaDto } from './dto/update-boleta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Boleta } from './entities/boleta.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BoletasService {
  constructor(
    @InjectRepository(Boleta)
    private readonly boletasRepository: Repository<Boleta>,
  ) {}

  async create(createBoletaDto: CreateBoletaDto) {
    return await this.boletasRepository.save(createBoletaDto);
  }

  async findAll() {
    return await this.boletasRepository.find();
  }

  async findOne(id: number) {
    return await this.boletasRepository.findOneBy({ numero_boleta: id });  
  }

  update(id: number, updateBoletaDto: UpdateBoletaDto) {
    return `This action updates a #${id} boleta`;
  }

  remove(id: number) {
    return `This action removes a #${id} boleta`;
  }
}
