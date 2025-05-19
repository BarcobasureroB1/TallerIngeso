import { IsNumber, IsString } from "class-validator";

export class AñadirStockDto {
    @IsString({message: 'El nombre debe ser un string' })
    nombre: string;
    @IsNumber({}, {message: 'El stock debe ser un numero' })
    stock: number;
}