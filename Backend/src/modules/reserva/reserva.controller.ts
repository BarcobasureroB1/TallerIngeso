import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { CancelarReservaDto } from './dto/cancelar-reserva.dto';
import { modificarReservaDto } from './dto/modificar-reserva.dto';

@Controller('reserva')
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

  @Post()
  create(@Body() createReservaDto: CreateReservaDto) {
    return this.reservaService.seleccrearreserva(createReservaDto);
  }

  @Get()
  findAll() {
    return this.reservaService.findAll();
  }

  @Get(':rut')
  findByRut(@Param('rut') rut: string) {
    return this.reservaService.findByRut(rut);
  }
  @Patch('cancelar')
  async cancelarReserva( @Body() dto: CancelarReservaDto) {
    console.log(dto);
    return await this.reservaService.cancelar(dto);

  }
  @Patch()
  update(@Body() dto: modificarReservaDto) {
    return this.reservaService.modificarReserva(dto);
  }
}
