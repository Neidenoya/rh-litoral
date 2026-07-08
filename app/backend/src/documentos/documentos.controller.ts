import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Perfil, TipoDocumento } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { DocumentosService } from './documentos.service';
import { CreateDocumentoDto } from './dto/create-documento.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('documentos')
export class DocumentosController {
  constructor(private readonly documentos: DocumentosService) {}

  @Get()
  findAll(
    @Query('colaboradorId') colaboradorId?: string,
    @Query('tipo') tipo?: TipoDocumento,
  ) {
    return this.documentos.findAll({ colaboradorId, tipo });
  }

  @Roles(Perfil.RH)
  @Post()
  create(@Body() dto: CreateDocumentoDto, @Req() req: any) {
    return this.documentos.create(dto, req.user?.id);
  }
}
