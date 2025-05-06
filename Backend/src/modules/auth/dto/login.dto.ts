import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
    @IsString({ message: 'El rut debe ser un string' })
    @IsNotEmpty({ message: 'El rut no puede estar vacio' })
    rut: string;
    @Transform(({ value }) => value.trim())
    @IsString({ message: 'La contraseña debe ser un string' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;
}