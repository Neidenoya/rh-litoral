import { Module } from '@nestjs/common';
import { OpcoesController } from './opcoes.controller';
import { OpcoesService } from './opcoes.service';

@Module({
  controllers: [OpcoesController],
  providers: [OpcoesService],
})
export class OpcoesModule {}
