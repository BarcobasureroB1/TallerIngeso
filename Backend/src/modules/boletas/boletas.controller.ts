import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BoletasService } from './boletas.service';
import { CreateBoletaDto } from './dto/create-boleta.dto';
import { UpdateBoletaDto } from './dto/update-boleta.dto';

@Controller('boletas')
export class BoletasController {
  constructor(private readonly boletasService: BoletasService) {}

  

  @Get()
  findAll() {
    return this.boletasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boletasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoletaDto: UpdateBoletaDto) {
    return this.boletasService.update(+id, updateBoletaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boletasService.remove(+id);
  }
  @Post()
  async crear() {
    return await this.boletasService.crearBoleta();
  }
}
