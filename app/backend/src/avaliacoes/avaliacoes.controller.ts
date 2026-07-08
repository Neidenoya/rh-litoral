import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AvaliacoesService } from './avaliacoes.service';

@UseGuards(JwtAuthGuard)
@Controller('avaliacoes')
export class AvaliacoesController {
  constructor(private readonly avaliacoes: AvaliacoesService) {}

  @Get()
  findAll(
    @Query('colaboradorId') colaboradorId?: string,
    @Query('ciclo') ciclo?: string,
  ) {
    return this.avaliacoes.findAll({ colaboradorId, ciclo });
  }
}
