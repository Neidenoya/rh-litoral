import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { TipoDocumento } from '@prisma/client';

export class CreateDocumentoDto {
  @IsUUID()
  colaboradorId!: string;

  @IsEnum(TipoDocumento)
  tipo!: TipoDocumento;

  @IsString()
  @IsNotEmpty()
  arquivoUrl!: string;
}
