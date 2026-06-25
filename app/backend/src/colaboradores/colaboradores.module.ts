import { Module } from '@nestjs/common';
import { OrganogramaModule } from '../organograma/organograma.module';
import { ColaboradoresController } from './colaboradores.controller';
import { ColaboradoresService } from './colaboradores.service';

@Module({
  imports: [OrganogramaModule],
  controllers: [ColaboradoresController],
  providers: [ColaboradoresService],
})
export class ColaboradoresModule {}
