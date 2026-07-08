import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PrioridadeVaga } from '@prisma/client';

export class CreateVagaDto {
  @IsUUID()
  cargoId!: string;

  @IsUUID()
  departamentoId!: string;

  @IsUUID()
  shoppingId!: string;

  @IsUUID()
  gestorSolicitanteId!: string;

  @IsOptional()
  @IsEnum(PrioridadeVaga)
  prioridade?: PrioridadeVaga;
}
