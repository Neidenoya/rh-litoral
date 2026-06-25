import { Controller, Get } from '@nestjs/common';
import { IndicadoresService } from './indicadores.service';

@Controller('indicadores')
export class IndicadoresController {
  constructor(private readonly indicadores: IndicadoresService) {}

  @Get('dashboard')
  dashboard() {
    return this.indicadores.dashboard();
  }
}
