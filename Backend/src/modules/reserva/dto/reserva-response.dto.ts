import { ClienteReservaDto } from './cliente-reserva.dto';
import { CanchaReservaDto } from './cancha-reserva.dto';

export class ReservaResponseDto {
  id_reserva: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  cliente: ClienteReservaDto;
  cancha: CanchaReservaDto;
}