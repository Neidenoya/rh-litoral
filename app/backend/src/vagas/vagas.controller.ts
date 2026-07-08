import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Perfil, PrioridadeVaga, StatusVaga } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { VagasService } from './vagas.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vagas')
export class VagasController {
  constructor(private readonly vagas: VagasService) {}

  @Get()
  findAll(
    @Query('status') status?: StatusVaga,
    @Query('prioridade') prioridade?: PrioridadeVaga,
    @Query('shoppingId') shoppingId?: string,
  ) {
    return this.vagas.findAll({ status, prioridade, shoppingId });
  }

  @Get('resumo')
  resumo() {
    return this.vagas.resumo();
  }

  @Roles(Perfil.RH)
  @Patch(':id/avancar')
  avancar(@Param('id') id: string) {
    return this.vagas.avancar(id);
  }

  @Roles(Perfil.RH)
  @Patch(':id/cancelar')
  cancelar(@Param('id') id: string) {
    return this.vagas.cancelar(id);
  }
}
