import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { EstadoCivil, StatusColaborador, TipoContrato } from '@prisma/client';

export class CreateColaboradorDto {
  @IsString()
  @IsNotEmpty()
  matricula!: string;

  @IsString()
  @IsNotEmpty()
  nomeCompleto!: string;

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsString()
  rg?: string;

  @IsUUID()
  cargoId!: string;

  @IsUUID()
  departamentoId!: string;

  @IsUUID()
  shoppingId!: string;

  @IsUUID()
  empresaId!: string;

  @IsOptional()
  @IsUUID()
  centroCustoId?: string;

  @IsOptional()
  @IsUUID()
  gestorImediatoId?: string;

  @IsDateString()
  dataAdmissao!: string;

  @IsEnum(TipoContrato)
  tipoContrato!: TipoContrato;

  @IsNumber()
  salario!: number;

  @IsOptional() @IsString() cargaHoraria?: string;
  @IsOptional() @IsString() escala?: string;
  @IsOptional() @IsString() horarioEntrada?: string;
  @IsOptional() @IsString() horarioSaida?: string;
  @IsOptional() @IsString() telefone?: string;
  @IsOptional() @IsString() celular?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() endereco?: string;
  @IsOptional() @IsEnum(EstadoCivil) estadoCivil?: EstadoCivil;
  @IsOptional() @IsString() escolaridade?: string;
  @IsOptional() @IsArray() cursos?: string[];
  @IsOptional() @IsEnum(StatusColaborador) status?: StatusColaborador;
  @IsOptional() @IsString() dataAniversario?: string;
}
