import { Module } from '@nestjs/common';
import { TreinamentosController } from './treinamentos.controller';
import { TreinamentosService } from './treinamentos.service';

@Module({
  controllers: [TreinamentosController],
  providers: [TreinamentosService],
})
export class TreinamentosModule {}
