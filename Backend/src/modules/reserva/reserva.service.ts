import { Injectable } from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Cancha } from '../cancha/entities/cancha.entity';
import { Equipamiento } from '../equipamento/entities/equipamento.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Boleta } from '../boletas/entities/boleta.entity';
import { ReservaResponseDto } from './dto/reserva-response.dto';
import { Notificacion } from '../notificacion/entities/notificacion.entity';
import { NotificacionService } from '../notificacion/notificacion.service';
import { CancelarReservaDto } from './dto/cancelar-reserva.dto';
import { modificarReservaDto } from './dto/modificar-reserva.dto';

@Injectable()
export class ReservaService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Equipamiento)
    private readonly equipamientoRepository: Repository<Equipamiento>,
    @InjectRepository(Cancha)
    private readonly canchaRepository: Repository<Cancha>,
    @InjectRepository(Boleta)
    private readonly boletaRepository: Repository<Boleta>,
    private readonly notificacionService: NotificacionService, // Asegúrate de que el servicio de notificaciones esté inyectado

  ) {}
 
  // Método para crear una reserva
  async crearReserva(dto: CreateReservaDto) {
  const cliente = await this.usuarioRepository.findOneBy({ rut: dto.rut_cliente });
  const cancha = await this.canchaRepository.findOneBy({ id_cancha: dto.id_cancha });
  
  if (!cliente) {
    throw new Error('Cliente no encontrado');
  }
  if (!cancha) {
    throw new Error('Cancha no encontrada');
  }
  if (await this.canchaOcupada(dto.id_cancha, dto.fecha, dto.hora_inicio, dto.hora_fin)) {
  throw new Error(`La cancha ya está ocupada entre ${dto.hora_inicio} y ${dto.hora_fin} ese día.`);
}
  const costoreserva = cancha.costo;
  if(cliente.saldo < costoreserva){
    throw new Error(`Saldo insuficiente. Se requieren $${costoreserva}, pero tienes $${cliente.saldo}`);
  
  }
  const fechaActual = new Date();
  const fechaReserva = new Date(dto.fecha);
  const diferenciaDias = Math.floor((fechaReserva.getTime() - fechaActual.getTime()) / (1000 * 60 * 60 * 24));

  if (diferenciaDias < 7) {
    throw new Error('Las reservas deben hacerse con al menos una semana de anticipación.');
  }
  if (dto.cantidad_jugadores > cancha.capacidad) {
    throw new Error(`La cancha tiene capacidad máxima de ${cancha.capacidad} jugadores. No se pueden reservar ${dto.cantidad_jugadores}.`);
  }
   const horaInicio = parseHora(dto.hora_inicio);
  const horaFin = parseHora(dto.hora_fin);
  if (horaInicio < 8 * 60 || horaFin > 20 * 60) {
    throw new Error('Las reservas deben estar entre las 08:00 y 20:00.');
  }
  const reservasClienteDia = await this.reservaRepository.find({
    where: {
      cliente: { rut: dto.rut_cliente },
      fecha: dto.fecha,
    },
  });

  let totalMinutos = 0;
  for (const r of reservasClienteDia) {
    const inicio = parseHora(r.hora_inicio);
    const fin = parseHora(r.hora_fin);
    totalMinutos += fin - inicio;
  }

  totalMinutos += horaFin - horaInicio;
  if (totalMinutos > 180) {
    throw new Error('No puedes reservar más de 180 minutos en un solo día.');
  }
  for (const r of reservasClienteDia) {
    const inicioExistente = parseHora(r.hora_inicio);
    const finExistente = parseHora(r.hora_fin);
    if (finExistente === horaInicio || horaFin === inicioExistente) {
      throw new Error('No puedes hacer reservas consecutivas el mismo día.');
    }
  }




  cliente.saldo -= costoreserva;
  await this.usuarioRepository.save(cliente);


  const boleta = this.boletaRepository.create()
  await this.boletaRepository.save(boleta);
  
  
  

  const reserva = this.reservaRepository.create({
    cliente,
    fecha: dto.fecha,
    hora_inicio: dto.hora_inicio,
    hora_fin: dto.hora_fin,
    cancha,
    equipamiento: dto.equipamiento,
    boleta: boleta,
    boletaEquipamiento: boleta,
    cantidad_jugadores: dto.cantidad_jugadores,
  });

  const reservaGuardada = await this.reservaRepository.save(reserva);
  console.log(boleta.numero_boleta);
  await this.notificacionService.createnoti(dto.rut_cliente, `Reserva creada para el ${dto.fecha} de ${dto.hora_inicio} a ${dto.hora_fin} en la cancha ${cancha.id_cancha}.`);
  return {
  id_reserva: reservaGuardada.id_reserva,
  fecha: reservaGuardada.fecha,
  hora_inicio: reservaGuardada.hora_inicio,
  hora_fin: reservaGuardada.hora_fin,
  cliente: {
    rut: cliente.rut,
    correo: cliente.correo,
  },
  cancha: {
    id_cancha: cancha.id_cancha,
    costo: cancha.costo,
  },
  id_boleta: boleta.numero_boleta, 
  cantidadJugadores: reservaGuardada.cantidad_jugadores,

};
}



// Método para crear una reserva como administrador
async crearReservaadmin(dto: CreateReservaDto) {
  const cliente = await this.usuarioRepository.findOneBy({ rut: dto.rut_cliente });
  const cancha = await this.canchaRepository.findOneBy({ id_cancha: dto.id_cancha });
  
  if (!cliente) {
    throw new Error('Cliente no encontrado');
  }
  if (!cancha) {
    throw new Error('Cancha no encontrada');
  }
  if (await this.canchaOcupada(dto.id_cancha, dto.fecha, dto.hora_inicio, dto.hora_fin)) {
  throw new Error(`La cancha ya está ocupada entre ${dto.hora_inicio} y ${dto.hora_fin} ese día.`);
}
 

  if (dto.cantidad_jugadores > cancha.capacidad) {
    throw new Error(`La cancha tiene capacidad máxima de ${cancha.capacidad} jugadores. No se pueden reservar ${dto.cantidad_jugadores}.`);
  }
  

  const boleta = this.boletaRepository.create()
  await this.boletaRepository.save(boleta);
  

  const reserva = this.reservaRepository.create({
    cliente,
    fecha: dto.fecha,
    hora_inicio: dto.hora_inicio,
    hora_fin: dto.hora_fin,
    cancha,
    equipamiento: dto.equipamiento,
    boletaEquipamiento: boleta,
    cantidad_jugadores: dto.cantidad_jugadores,
  });

  const reservaGuardada = await this.reservaRepository.save(reserva);
  await this.notificacionService.createnoti(dto.rut_cliente, `Reserva creada para el ${dto.fecha} de ${dto.hora_inicio} a ${dto.hora_fin} en la cancha ${cancha.id_cancha}.`);
  
  return {
  id_reserva: reservaGuardada.id_reserva,
  fecha: reservaGuardada.fecha,
  hora_inicio: reservaGuardada.hora_inicio,
  hora_fin: reservaGuardada.hora_fin,
  cliente: {
    rut: cliente.rut,
    correo: cliente.correo,
  },
  cancha: {
    id_cancha: cancha.id_cancha,
    costo: cancha.costo,
  },
  id_boleta: boleta.numero_boleta, 
  cantidadJugadores: reservaGuardada.cantidad_jugadores,
};
}

async findAll() {
  const reservas = await this.reservaRepository.find({
    
    relations: [
    'cliente',
    'cancha',
    'boletaEquipamiento',
    'boletaEquipamiento.relaciones',
    'boletaEquipamiento.relaciones.equipamiento',
    'boleta.jugadores',
    ],
    order: { fecha: 'ASC' },
  });

  return reservas.map((reserva) => ({
    id_reserva: reserva.id_reserva,
    fecha: reserva.fecha,
    hora_inicio: reserva.hora_inicio,
    hora_fin: reserva.hora_fin,
    cliente: {
      rut: reserva.cliente.rut,
      correo: reserva.cliente.correo,
    },
    cancha: {
      id_cancha: reserva.cancha.id_cancha,
      costo: reserva.cancha.costo,
    },
    equipamientoAsignado: reserva.boletaEquipamiento?.relaciones?.map(be => ({
      nombre: be.equipamiento.nombre,
      cantidad: be.cantidad,
    })) || [],
    jugadores: reserva.boleta?.jugadores?.map(j => ({
    nombre: j.nombres_jugador,
    apellidos: j.apellidos_jugador,
    rut: j.rut_jugador,
    edad: j.edad_jugador,
  })) || [],
    cancelada: reserva.cancelado,
  }));
}

async findvigentes() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0); // Eliminamos hora para comparar solo fechas
    const fechaString = hoy.toISOString().split('T')[0];
  const reservas = await this.reservaRepository.find({
    where: { cancelado: false,
      fecha: MoreThanOrEqual(fechaString),
     },
    relations: [
    'cliente',
    'cancha',
    'boletaEquipamiento',
    'boletaEquipamiento.relaciones',
    'boletaEquipamiento.relaciones.equipamiento',
    'boleta.jugadores',
    ],
    order: { fecha: 'ASC' },
  });

  return reservas.map((reserva) => ({
    id_reserva: reserva.id_reserva,
    fecha: reserva.fecha,
    hora_inicio: reserva.hora_inicio,
    hora_fin: reserva.hora_fin,
    cliente: {
      rut: reserva.cliente.rut,
      correo: reserva.cliente.correo,
    },
    cancha: {
      id_cancha: reserva.cancha.id_cancha,
      costo: reserva.cancha.costo,
    },
    equipamientoAsignado: reserva.boletaEquipamiento?.relaciones?.map(be => ({
      nombre: be.equipamiento.nombre,
      cantidad: be.cantidad,
    })) || [],
    jugadores: reserva.boleta?.jugadores?.map(j => ({
    nombre: j.nombres_jugador,
    apellidos: j.apellidos_jugador,
    rut: j.rut_jugador,
    edad: j.edad_jugador,
  })) || [],
  }));

}

  async findByRut(rut: string) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0); // Eliminamos hora para comparar solo fechas
    const fechaString = hoy.toISOString().split('T')[0];

  const reservas = await this.reservaRepository.find({
    where: {
      cancelado: false,
      cliente: { rut },
      fecha: MoreThanOrEqual(fechaString),
    },
    relations: [
      'cliente',
      'cancha',
      'boletaEquipamiento',
      'boletaEquipamiento.relaciones',
      'boletaEquipamiento.relaciones.equipamiento',
      'boleta.jugadores', 
    ],
    order: {
      fecha: 'ASC', 
    },
  });

  return reservas.map((reserva) => ({
    id_reserva: reserva.id_reserva,
    fecha: reserva.fecha,
    hora_inicio: reserva.hora_inicio,
    hora_fin: reserva.hora_fin,
    cliente: {
      rut: reserva.cliente.rut,
      correo: reserva.cliente.correo,
    },
    cancha: {
      id_cancha: reserva.cancha.id_cancha,
      costo: reserva.cancha.costo,
    },
    equipamientoAsignado: reserva.boletaEquipamiento?.relaciones?.map((rel) => ({
      nombre: rel.equipamiento?.nombre ?? 'Desconocido',
      cantidad: rel.cantidad,
    })) || [],
    jugadores: reserva.boleta?.jugadores?.map(j => ({
    nombre: j.nombres_jugador,
    apellidos: j.apellidos_jugador,
    rut: j.rut_jugador,
    edad: j.edad_jugador,
  })) || [],
  }));
}

  update(id: number, updateReservaDto: UpdateReservaDto) {
    return `This action updates a #${id} reserva`;
  }

  remove(id: number) {
    return `This action removes a #${id} reserva`;
  }

  // Método para cancelar una reserva
  async cancelar(dto: CancelarReservaDto) {
  const reserva = await this.reservaRepository.findOne({
  where: { id_reserva: dto.id_reserva, cancelado: false },
  relations: ['cliente', 'cancha'],
  });
  if (!reserva) {
    throw new Error('Reserva no encontrada');
  }
  const fechaActual = new Date();
  const fechaReserva = new Date(reserva.fecha);
  const diferenciaDias = Math.floor((fechaReserva.getTime() - fechaActual.getTime()) / (1000 * 60 * 60 * 24));
  
  if (!dto.admin) {
  if (diferenciaDias < 7) {
    throw new Error('No se puede cancelar una reserva con menos de 7 días de anticipación.');
  }
  }
  console.log(reserva.cliente);
  reserva.cancelado = true;
  await this.notificacionService.createnoti(reserva.cliente.rut, `Reserva del ${reserva.fecha} de ${reserva.hora_inicio} a ${reserva.hora_fin} en la cancha ${reserva.cancha.id_cancha} ha sido cancelada.`);
  
  return await this.reservaRepository.save(reserva);
}
// Método para crear una reserva, diferenciando entre cliente y administrador
async seleccrearreserva(dto: CreateReservaDto) {
  const cliente = await this.usuarioRepository.findOneBy({ rut: dto.rut_cliente });
  if( dto.rut_admin) {
    console.log(dto.rut_admin);
    return await this.crearReservaadmin(dto);
  }
  if (!cliente) {
    throw new Error('Cliente no encontrado');
  }
  
  else {
    return await this.crearReserva(dto);
  //return await this.crearReservaadmin(dto);
  }


}
// Método para verificar si una cancha está ocupada en una fecha y rango horario específicos
private async canchaOcupada(
  id_cancha: number,
  fecha: string,
  horaInicio: string,
  horaFin: string,
  idReservaActual?: number // opcional para ignorar la reserva actual si estás editando
): Promise<boolean> {
  const reservas = await this.reservaRepository.find({
    where: {
      cancha: { id_cancha },
      fecha,
    },
  });

  const inicioNueva = parseHora(horaInicio);
  const finNueva = parseHora(horaFin);

  for (const reserva of reservas) {
    // Si estás modificando, salta la reserva actual
    if (idReservaActual && reserva.id_reserva === idReservaActual) {
      continue;
    }

    const inicioExistente = parseHora(reserva.hora_inicio);
    const finExistente = parseHora(reserva.hora_fin);

    const traslape =
      (inicioNueva < finExistente && finNueva > inicioExistente); // intersección de rangos

    if (traslape) {
      return true;
    }
  }

  return false;
}


// Método para modificar una reserva
async modificarReserva(dto: modificarReservaDto) {

  const reserva = await this.reservaRepository.findOne({ where: {id_reserva : dto.id_reserva}, relations: ['cancha', 'cliente'] }
        
       );
  if (!reserva) {
    throw new Error('Reserva no encontrada');
  }
  if(!dto.admin){
    const fechaActual = new Date();
    const fechaReserva = new Date(reserva.fecha);
    const diferenciaDias = Math.floor((fechaReserva.getTime() - fechaActual.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diferenciaDias < 7) {
      throw new Error('No se puede modificar una reserva con menos de 7 días de anticipación.');
    }

  }

  if (dto.id_cancha) {
    const cancha = await this.canchaRepository.findOneBy({ id_cancha: dto.id_cancha });
    if (!cancha) {
      throw new Error('Cancha no encontrada');
    }
     const reserva = await this.reservaRepository.findOne({ where: {id_reserva : dto.id_reserva}, relations: ['cancha', 'cliente'] })
    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }
    if (await this.canchaOcupada(dto.id_cancha, reserva.fecha, reserva.hora_inicio, reserva.hora_fin, dto.id_reserva)) {
      throw new Error(`La cancha ya está ocupada entre ${reserva.hora_inicio} y ${reserva.hora_fin} ese día.`);
    }
   
    reserva.cancha = cancha;
    await this.reservaRepository.save(reserva);
    return await this.notificacionService.createnoti(reserva.cliente.rut, `La cancha de la reserva del ${reserva.fecha} ha sido modificada a la cancha ${cancha.id_cancha}.`);

  
  }
   if(dto.hora_inicio && dto.hora_fin && dto.fecha){
      const reserva = await this.reservaRepository.findOne({ where: {id_reserva : dto.id_reserva}, relations: ['cancha', 'cliente'] }
        
       );
      if (!reserva) {
        throw new Error('Reserva no encontrada');
      }
      console.log(reserva);

      const cancha = reserva.cancha
      console.log(cancha);
      

      if (await this.canchaOcupada(cancha.id_cancha, dto.fecha, dto.hora_inicio, dto.hora_fin, dto.id_reserva)) {
        throw new Error(`La cancha ya está ocupada entre ${dto.hora_inicio} y ${dto.hora_fin} ese día.`);
      }
      const horaInicio = parseHora(dto.hora_inicio);
      const horaFin = parseHora(dto.hora_fin);
      if (horaInicio < 8 * 60 || horaFin > 20 * 60) {
        throw new Error('Las reservas deben estar entre las 08:00 y 20:00.');
      }
    
      reserva.hora_inicio = dto.hora_inicio;
      reserva.hora_fin = dto.hora_fin;
      reserva.fecha = dto.fecha;
      await this.reservaRepository.save(reserva);
      return await this.notificacionService.createnoti(reserva.cliente.rut, `La hora de la reserva del ${reserva.fecha} ha sido modificada de ${reserva.hora_inicio} a ${reserva.hora_fin}.`);
    }
    
   
  

}




}
function parseHora(horaStr: string): number {
  const [horas, minutos] = horaStr.split(':').map(Number);
  return horas * 60 + minutos;
}





