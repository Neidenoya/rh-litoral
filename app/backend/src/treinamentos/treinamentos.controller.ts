import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StatusTreinamento } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TreinamentosService } from './treinamentos.service';

@UseGuards(JwtAuthGuard)
@Controller('treinamentos')
export class TreinamentosController {
  constructor(private readonly treinamentos: TreinamentosService) {}

  @Get()
  catalogo() {
    return this.treinamentos.catalogo();
  }

  @Get('colaboradores')
  matriculas(
    @Query('status') status?: StatusTreinamento,
    @Query('colaboradorId') colaboradorId?: string,
  ) {
    return this.treinamentos.matriculas({ status, colaboradorId });
  }

  @Get('resumo')
  resumo() {
    return this.treinamentos.resumo();
  }
}
