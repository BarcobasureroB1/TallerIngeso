import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BoletaJugadoresService } from './boleta-jugadores.service';
import { CreateBoletaJugadoreDto } from './dto/create-boleta-jugadore.dto';
import { UpdateBoletaJugadoreDto } from './dto/update-boleta-jugadore.dto';
import { JugadorDto } from './dto/jugador.dto';

@Controller('jugador')
export class BoletaJugadoresController {
  constructor(private readonly boletaJugadoresService: BoletaJugadoresService) {}

  @Post()
  create(@Body() dto: JugadorDto) {
    console.log('Creando jugador con datos:', dto);
    return this.boletaJugadoresService.createJugador(dto);
  }

  @Get()
  findAll() {
    return this.boletaJugadoresService.findAll();
  }
  @Get(':numero_boleta')
  findOne(@Param('numero_boleta') numero_boleta: string) {
    return this.boletaJugadoresService.findby(numero_boleta);
  }


  
}
