import { IsEmail, IsNotEmpty, IsOptional, IsString, min, minLength } from 'class-validator';
export class CreateUsuarioDto {
    @IsString({message: 'El rut debe ser un string' })
    @IsNotEmpty({message: 'El rut no puede estar vacio'})
    rut: string;
    @IsEmail()
    @IsNotEmpty({message: 'El correo no puede estar vacio' })
    correo: string;
    @IsString({message: 'La contraseña debe ser un string' })
    @IsNotEmpty({message: 'La contraseña no puede estar vacia' })
    password: string;
    @IsString({message: 'El nombre debe ser un string' })
    @IsNotEmpty({message: 'El nombre no puede estar vacio' })
    nombre: string;
    

}
