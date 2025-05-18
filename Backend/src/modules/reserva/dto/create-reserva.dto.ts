import { IsBoolean, IsDateString, IsNumber, IsString } from 'class-validator';

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

  // Si se pide equipamiento, se envía la lista
  lista_equipamiento?: {
    nombre: string;
    cantidad: number;
  }[];


}