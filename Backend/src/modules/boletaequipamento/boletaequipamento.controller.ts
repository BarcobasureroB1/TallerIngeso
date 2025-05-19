import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { BoletaequipamentoService } from './boletaequipamento.service';
import { CreateBoletaequipamentoDto } from './dto/create-boletaequipamento.dto';
import { UpdateBoletaequipamentoDto } from './dto/update-boletaequipamento.dto';
import { AgregarEquipamientoDto } from './dto/agregarequipamento.dto';

@Controller('boletaequipamento')
export class BoletaequipamentoController {
  constructor(private readonly boletaequipamentoService: BoletaequipamentoService) {}

  
  @Get('total/:numeroBoleta')
calcularTotal(@Param('numeroBoleta', ParseIntPipe) numeroBoleta: number) {
  return this.boletaequipamentoService.calcularTotalBoleta(numeroBoleta);
}
@Post('agregar')
  async agregarEquipamiento(@Body() dto: AgregarEquipamientoDto) {
    return this.boletaequipamentoService.agregarEquipamientoABoleta(dto);
  }


}
