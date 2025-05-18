import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { AgregarSaldoDto } from './dto/agregar-saldo.dto';
@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}
  async registrar(createUsuarioDto: CreateUsuarioDto) {
    const usuario = this.usuarioRepository.create({
      ...createUsuarioDto,
      saldo: 0,
      admin: false,
    });
    return await this.usuarioRepository.save(usuario);
  }
  async findOneByEmail(correo: string) {
    return await this.usuarioRepository.findOneBy({ correo });
  }
  async findAll() {
    return await this.usuarioRepository.find();
  }

  async findOne(rut: string) {
    return await this.usuarioRepository.findOneBy({ rut});
  }

  async update(rut: string, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${rut} usuario`;
  }

  async remove(rut: string) {
    return `This action removes a #${rut} usuario`;
  }
  async agregarSaldo(rut: string ,agregarSaldoDto: AgregarSaldoDto) {
    const usuario = await this.usuarioRepository.findOneBy({
      rut
    });
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    usuario.saldo += agregarSaldoDto.saldo;
    return await this.usuarioRepository.save(usuario);
  }
  
}
