import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RelatoriosService } from './relatorios.service';

@UseGuards(JwtAuthGuard)
@Controller('relatorios')
export class RelatoriosController {
  constructor(private readonly relatorios: RelatoriosService) {}

  @Get('quadro')
  quadro(@Req() req: any) {
    return this.relatorios.quadro(req.user?.perfil);
  }
}
