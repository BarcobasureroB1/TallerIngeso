import { PartialType } from '@nestjs/mapped-types';
import { CreateBoletaequipamentoDto } from './create-boletaequipamento.dto';

export class UpdateBoletaequipamentoDto extends PartialType(CreateBoletaequipamentoDto) {}
