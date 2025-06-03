import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CancelarReservaDto {
    @IsNumber()
    id_reserva: number;
    
    @IsBoolean()
    admin: boolean;



    
}