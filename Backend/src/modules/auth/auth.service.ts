import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { RegisterDto } from './dto/register.dto';
import * as bcryptjs from 'bcryptjs'; // Import bcrypt for password hashing
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt'; // Import JwtService for token generation
@Injectable()
export class AuthService {
    constructor(
        private readonly usuariosService: UsuariosService, // Inject the UsuariosService
        private readonly jwtService: JwtService, // Inject the JwtService for token generation  
    ) {}

    async register({rut, correo, password, nombre}: RegisterDto) {
        const user = await this.usuariosService.findOneByEmail(correo); // Check if the user already exists
        if (user) {
            throw new BadRequestException("El usuario ya existe")// Return a message if the user already exists
        }
        return await this.usuariosService.registrar({
            rut,
            correo,
            password: await bcryptjs.hash(password, 10),
            nombre // Hash the password before saving it
         }); // Return a success message
    }
    async login({rut, password}: LoginDto) {
        const user = await this.usuariosService.findOne(rut); // Check if the user exists
        if (!user) {
            throw new UnauthorizedException("credenciales invalidas")// Return a message if the user does not exist
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password); // Compare the password with the hashed password
        if (!isPasswordValid) {
            throw new UnauthorizedException("credenciales invalidas")// Return a message if the password is invalid
        }
        const payload = { rut: user.rut, correo: user.correo, saldo: user.saldo, admin: user.admin, nombre: user.nombre }; // Create a payload with the user's information
        const token = await this.jwtService.signAsync(payload); // Generate a JWT token with the payload

        return token;
    }

    
    
}
