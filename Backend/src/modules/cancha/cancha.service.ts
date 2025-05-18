import { Injectable } from '@nestjs/common';
import { CreateCanchaDto } from './dto/create-cancha.dto';
import { UpdateCanchaDto } from './dto/update-cancha.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cancha } from './entities/cancha.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CanchaService {
  constructor(
    @InjectRepository(Cancha)
    private readonly canchaRepository: Repository<Cancha>,
  ) {}
  async create(createCanchaDto: CreateCanchaDto) {
    return await this.canchaRepository.save(createCanchaDto);
  }

  async findAll() {
    return await this.canchaRepository.find();
  }

  async findOne(id: number) {
    return await this.canchaRepository.findOneBy({ id_cancha: id });
  }

  update(id: number, updateCanchaDto: UpdateCanchaDto) {
    return `This action updates a #${id} cancha`;
  }

  remove(id: number) {
    return `This action removes a #${id} cancha`;
  }
}
