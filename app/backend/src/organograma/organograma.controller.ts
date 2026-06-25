import { Controller, Get, Param } from '@nestjs/common';
import { OrganogramaService } from './organograma.service';

@Controller('organograma')
export class OrganogramaController {
  constructor(private readonly organograma: OrganogramaService) {}

  @Get()
  arvore() {
    return this.organograma.arvore();
  }

  @Get(':id/subordinados')
  subordinados(@Param('id') id: string) {
    return this.organograma.subordinados(id);
  }
}
