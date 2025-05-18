import { Controller, Get, Post, Body, Patch, Param, Delete,  } from '@nestjs/common';
import { EquipamentoService } from './equipamento.service';
import { CreateEquipamentoDto } from './dto/create-equipamento.dto';
import { UpdateEquipamentoDto } from './dto/update-equipamento.dto';
import { AñadirStockDto } from './dto/añadir-stock.dto';

@Controller('equipamento')
export class EquipamentoController {
  constructor(private readonly equipamentoService: EquipamentoService) {}

  @Post()
  create(@Body() createEquipamentoDto: CreateEquipamentoDto) {
    return this.equipamentoService.create(createEquipamentoDto);
  }

  @Get()
  findAll() {
    return this.equipamentoService.findAll();
  }
  @Patch('stock')
  async updateStock(@Body() dto: AñadirStockDto ) {
    return await this.equipamentoService.anadirStock(dto);
  }
 
}
