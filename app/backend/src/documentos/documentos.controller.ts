import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { TipoDocumento } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DocumentosService } from './documentos.service';

@UseGuards(JwtAuthGuard)
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
}
