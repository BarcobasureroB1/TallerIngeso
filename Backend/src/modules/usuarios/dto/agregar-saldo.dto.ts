import { IsNumber } from "class-validator";

export class AgregarSaldoDto {
  @IsNumber()
  saldo: number;
}