import { PartialType } from '@nestjs/mapped-types';
import { CreateBoletaJugadoreDto } from './create-boleta-jugadore.dto';

export class UpdateBoletaJugadoreDto extends PartialType(CreateBoletaJugadoreDto) {}
