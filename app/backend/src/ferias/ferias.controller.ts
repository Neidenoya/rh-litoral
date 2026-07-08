import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StatusFerias } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FeriasService } from './ferias.service';

@UseGuards(JwtAuthGuard)
@Controller('ferias')
export class FeriasController {
  constructor(private readonly ferias: FeriasService) {}

  @Get()
  findAll(
    @Query('colaboradorId') colaboradorId?: string,
    @Query('status') status?: StatusFerias,
  ) {
    return this.ferias.findAll({ colaboradorId, status });
  }

  @Get('resumo')
  resumo() {
    return this.ferias.resumo();
  }
}
