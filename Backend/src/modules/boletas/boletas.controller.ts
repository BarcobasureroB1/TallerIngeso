import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BoletasService } from './boletas.service';
import { CreateBoletaDto } from './dto/create-boleta.dto';
import { UpdateBoletaDto } from './dto/update-boleta.dto';

@Controller('boletas')
export class BoletasController {
  constructor(private readonly boletasService: BoletasService) {}

  

  @Post()
  async crear() {
    return await this.boletasService.crearBoleta();
  }
}
