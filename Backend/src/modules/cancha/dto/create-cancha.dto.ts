import { IsNumber } from "class-validator";

export class CreateCanchaDto {

    @IsNumber({}, { message: 'El costo debe ser un numero' })
    costo: number;
    @IsNumber({}, { message: 'La capacidad debe ser un numero' })
    capacidad: number;
    
}
