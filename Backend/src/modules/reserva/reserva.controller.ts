import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';

@Controller('reserva')
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

  @Post()
  create(@Body() createReservaDto: CreateReservaDto) {
    return this.reservaService.crearReserva(createReservaDto);
  }

  @Get()
  findAll() {
    return this.reservaService.findAll();
  }

  @Get(':rut')
  findByRut(@Param('rut') rut: string) {
    return this.reservaService.findByRut(rut);
  }
  @Patch(':id')
  async cancelarReserva(@Param('id', ParseIntPipe) id: number) {
    return await this.reservaService.cancelar(id);

  }
}
