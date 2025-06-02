import { IsNumber, IsString } from "class-validator";

export class JugadorDto {
    @IsNumber()
    numero_boleta: number;
    @IsString()
    nombres_jugador: string;
    @IsString()
    apellidos_jugador: string;
    @IsString()
    rut_jugador: string;
    @IsNumber()
    edad_jugador: number; // Assuming edad is a string, if it's a number, change to @IsNumber()

   
    }