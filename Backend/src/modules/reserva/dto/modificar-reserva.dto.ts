import { IsString, IsNumber, IsBoolean } from "class-validator";

export class modificarReservaDto {
    @IsString()
    rutUsuario: string;

    @IsNumber()
    id_reserva: number;
    @IsString()
    fecha?: string;

    @IsString()
    hora_inicio?: string;

    @IsString()
    hora_fin?: string;

    @IsString()
    idEquipamento?: string;

    @IsNumber()
    cantidad?: number;

    @IsNumber()
    id_cancha?: number;
    @IsBoolean()
    admin: boolean;
    

}   