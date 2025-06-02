import { IsNumber, IsString } from "class-validator";

export class CancelarReservaDto {
    @IsString()
    rutUsuario: string;

   

    
}