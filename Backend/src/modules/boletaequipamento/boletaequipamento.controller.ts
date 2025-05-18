import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { BoletaequipamentoService } from './boletaequipamento.service';
import { CreateBoletaequipamentoDto } from './dto/create-boletaequipamento.dto';
import { UpdateBoletaequipamentoDto } from './dto/update-boletaequipamento.dto';
import { AgregarEquipamientoDto } from './dto/agregarequipamento.dto';

@Controller('boletaequipamento')
export class BoletaequipamentoController {
  constructor(private readonly boletaequipamentoService: BoletaequipamentoService) {}

  @Post()
  create(@Body() createBoletaequipamentoDto: CreateBoletaequipamentoDto) {
    return this.boletaequipamentoService.create(createBoletaequipamentoDto);
  }

  @Get()
  findAll() {
    return this.boletaequipamentoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boletaequipamentoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoletaequipamentoDto: UpdateBoletaequipamentoDto) {
    return this.boletaequipamentoService.update(+id, updateBoletaequipamentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boletaequipamentoService.remove(+id);
  }
  @Get('total/:numeroBoleta')
calcularTotal(@Param('numeroBoleta', ParseIntPipe) numeroBoleta: number) {
  return this.boletaequipamentoService.calcularTotalBoleta(numeroBoleta);
}
@Post('agregar')
  async agregarEquipamiento(@Body() dto: AgregarEquipamientoDto) {
    return this.boletaequipamentoService.agregarEquipamientoABoleta(dto);
  }

  
}
