import { Module } from '@nestjs/common';
import { OrganogramaController } from './organograma.controller';
import { OrganogramaService } from './organograma.service';

@Module({
  controllers: [OrganogramaController],
  providers: [OrganogramaService],
  exports: [OrganogramaService],
})
export class OrganogramaModule {}
