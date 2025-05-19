import { IsString, IsNumber } from 'class-validator';

export class AgregarEquipamientoDto {
  @IsNumber()
  numero_boleta: number;

  @IsString()
  nombre_equipamiento: string;

  @IsNumber()
  cantidad: number;
}