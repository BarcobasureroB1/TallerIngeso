import { Body, Controller, Post,Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guard/auth.guard';

@Controller('auth')
export class AuthController {
   constructor(
    private readonly authService: AuthService, // Inject the AuthService
   ) {}


   @Post('Register')
    register(
        @Body()
        registerDto: RegisterDto, // Use the RegisterDto for validation
    ) {
        console.log(registerDto); // Log the registerDto for debugging
        return this.authService.register(registerDto); // Call the register method from AuthService
    }
   
    @Post('Login')
    login(
        @Body()
        loginDto: LoginDto, // Use the RegisterDto for validation
    ) {
        
        return this.authService.login(loginDto); // Call the login method from AuthService
    }
    @Get('profile')
    @UseGuards(AuthGuard)
    profile(
        @Request() req
    ) {
     return req.Usuario; 
    }
}
