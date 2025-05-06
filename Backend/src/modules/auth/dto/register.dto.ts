import { Transform } from "class-transformer";
import { IsEmail, IsString, Min, MinLength } from "class-validator";


export class RegisterDto {
    @IsString   ({message: 'El rut debe ser un string' })
    rut: string;

    @IsEmail()
    correo: string;

    @Transform(({ value }) => value.trim())
    @IsString   ({message: 'La contraseña debe ser un string' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;

}