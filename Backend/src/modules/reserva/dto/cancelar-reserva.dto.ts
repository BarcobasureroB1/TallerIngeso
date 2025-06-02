import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CancelarReservaDto {
    @IsString()
    id_reserva: string;
    
    @IsBoolean()
    admin: boolean;



    
}