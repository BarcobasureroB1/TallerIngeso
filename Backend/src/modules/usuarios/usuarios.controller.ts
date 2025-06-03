import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { AgregarSaldoDto } from './dto/agregar-saldo.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.registrar(createUsuarioDto);
  }
  @Post(':rut')
  admin(@Param('rut') rut: string) {
    return this.usuariosService.makeadmin(rut);
  }

  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':rut')
  findOne(@Param('rut') rut: string) {
    return this.usuariosService.findOne(rut );
  }

  @Patch(':rut')
  update(@Param('rut')rut: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(rut, updateUsuarioDto);
  }

  @Delete(':rut')
  remove(@Param('rut') rut: string) {
    return this.usuariosService.remove(rut);
  }
 @Post('agregar-saldo')
@UseGuards(AuthGuard)
agregarSaldo(@Request() req, @Body() dto: AgregarSaldoDto) {
  const rut = req.Usuario.rut;
  console.log('Usuario desde el token:', rut);
  return this.usuariosService.agregarSaldo(rut, dto);
}
}
