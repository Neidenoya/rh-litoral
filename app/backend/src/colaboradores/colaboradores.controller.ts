import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Perfil, StatusColaborador } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ColaboradoresService } from './colaboradores.service';
import { CreateColaboradorDto } from './dto/create-colaborador.dto';
import { UpdateColaboradorDto } from './dto/update-colaborador.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('colaboradores')
export class ColaboradoresController {
  constructor(private readonly colaboradores: ColaboradoresService) {}

  @Get()
  findAll(
    @Req() req: any,
    @Query('shoppingId') shoppingId?: string,
    @Query('departamentoId') departamentoId?: string,
    @Query('status') status?: StatusColaborador,
    @Query('busca') busca?: string,
  ) {
    return this.colaboradores.findAll(
      { shoppingId, departamentoId, status, busca },
      req.user?.perfil,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.colaboradores.findOne(id, req.user?.perfil);
  }

  @Roles(Perfil.RH)
  @Post()
  create(@Body() dto: CreateColaboradorDto) {
    return this.colaboradores.create(dto);
  }

  @Roles(Perfil.RH)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateColaboradorDto, @Req() req: any) {
    return this.colaboradores.update(id, dto, req.user?.id);
  }

  @Roles(Perfil.RH)
  @Patch(':id/desligar')
  desligar(
    @Param('id') id: string,
    @Body() body: { motivo: string; data: string },
    @Req() req: any,
  ) {
    return this.colaboradores.desligar(id, body.motivo, body.data, req.user?.id);
  }
}
