import { IsString, IsNumber } from "class-validator";

export class modificarReservaDto {
    @IsString()
    rutUsuario: string;

    @IsNumber()
    idReserva: number;

    @IsString()
    hora_Inicio?: string;

    @IsString()
    hora_Termino?: string;

    @IsString()
    idEquipamento?: string;

    @IsNumber()
    cantidad?: number;

    @IsNumber()
    idCancha?: number;
    

}   