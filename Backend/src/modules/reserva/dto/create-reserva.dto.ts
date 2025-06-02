import { IsArray, IsBoolean, IsDateString, IsNumber, IsString, ValidateNested } from 'class-validator';
import { JugadorDto } from '../../boleta-jugadores/dto/jugador.dto';
import { Type } from 'class-transformer';

export class CreateReservaDto {
  @IsString()
  rut_cliente: string;

  @IsDateString()
  fecha: string;

  @IsString()
  hora_inicio: string;

  @IsString()
  hora_fin: string;

  @IsNumber()
  id_cancha: number;

  @IsBoolean()
  equipamiento: boolean;
  
  @IsNumber()
  cantidad_jugadores: number;

  
  

  

}