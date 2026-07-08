import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OpcoesService } from './opcoes.service';

@UseGuards(JwtAuthGuard)
@Controller('opcoes')
export class OpcoesController {
  constructor(private readonly opcoes: OpcoesService) {}

  @Get()
  listar() {
    return this.opcoes.listar();
  }
}
