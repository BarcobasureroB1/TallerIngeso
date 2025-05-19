import { IsNumber } from "class-validator";

export class CreateCanchaDto {

    @IsNumber({}, { message: 'El costo debe ser un numero' })
    costo: number;
}
