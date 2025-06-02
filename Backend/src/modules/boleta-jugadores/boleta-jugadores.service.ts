import { Injectable } from '@nestjs/common';
import { CreateBoletaJugadoreDto } from './dto/create-boleta-jugadore.dto';
import { UpdateBoletaJugadoreDto } from './dto/update-boleta-jugadore.dto';
import { JugadorDto } from './dto/jugador.dto';
import { BoletaJugadores } from './entities/boleta-jugadore.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Boleta } from '../boletas/entities/boleta.entity';

@Injectable()
export class BoletaJugadoresService {
 constructor(
  @InjectRepository(BoletaJugadores)
  private readonly boletaJugadoresRepository: Repository<BoletaJugadores>,
  @InjectRepository(Boleta)
  private readonly boletaRepository: Repository<Boleta>,


 ){

 }

 async findby(numero_boleta: string): Promise<BoletaJugadores[]> {
  const boleta = await this.boletaRepository.findOneBy({ numero_boleta: Number(numero_boleta) });
  if (!boleta) {
    throw new Error('Boleta no encontrada');
  }
  return this.boletaJugadoresRepository.find({ where: { boleta } });
  }

  
  
  findAll() {
    return `This action returns all boletaJugadores`;
  }

  

  
  async createJugador(dto: JugadorDto): Promise<BoletaJugadores> {
    const boleta = await this.boletaRepository.findOneBy({ numero_boleta: dto.numero_boleta });
    if (!boleta) {
      throw new Error('Boleta no encontrada');
    }
    const jugador = new BoletaJugadores();
    jugador.nombres_jugador = dto.nombres_jugador;
    jugador.apellidos_jugador = dto.apellidos_jugador;
    jugador.rut_jugador = dto.rut_jugador;
    jugador.edad_jugador = dto.edad_jugador;

    

    return this.boletaJugadoresRepository.save(jugador); 
  }
}

