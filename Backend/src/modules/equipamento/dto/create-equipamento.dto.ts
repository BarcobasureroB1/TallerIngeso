import { IsNumber, IsString } from "class-validator";

export class CreateEquipamentoDto {
    @IsString({message: 'El nombre debe ser un string' })
    nombre: string;
    @IsNumber({}, {message: 'El stock debe ser un numero' })
    stock: number;
    @IsString({message: 'El tipo debe ser un string' })
    tipo: string;
    @IsNumber({}, {message: 'El costo debe ser un numero' })
    costo: number;

}
