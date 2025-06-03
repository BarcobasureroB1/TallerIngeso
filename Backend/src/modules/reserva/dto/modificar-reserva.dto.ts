import { IsString, IsNumber, IsBoolean, IsOptional } from "class-validator";

export class modificarReservaDto {
    
    @IsNumber()
    id_reserva: number;
    @IsString()
    @IsOptional()
    fecha?: string;
    
    
    @IsString()
    @IsOptional()
    hora_inicio?: string;

    @IsString()
    @IsOptional()
    hora_fin?: string;
    @IsNumber()
    @IsOptional()
    id_cancha?: number;
    @IsBoolean()
    admin: boolean;
    

}   