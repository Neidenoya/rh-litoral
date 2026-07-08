import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrioridadeVaga, Prisma, StatusVaga } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVagaDto } from './dto/create-vaga.dto';

// Ordem do funil de R&S (CANCELADA fica fora — é estado terminal alternativo).
const FLUXO: StatusVaga[] = [
  'ABERTA',
  'TRIAGEM',
  'ENTREVISTA_RH',
  'ENTREVISTA_GESTOR',
  'APROVADO',
  'CONTRATADO',
];

export interface FiltroVaga {
  status?: StatusVaga;
  prioridade?: PrioridadeVaga;
  shoppingId?: string;
}

@Injectable()
export class VagasService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filtro: FiltroVaga) {
    const where: Prisma.VagaWhereInput = {};
    if (filtro.status) where.status = filtro.status;
    if (filtro.prioridade) where.prioridade = filtro.prioridade;
    if (filtro.shoppingId) where.shoppingId = filtro.shoppingId;

    return this.prisma.vaga.findMany({
      where,
      include: {
        cargo: { select: { nome: true } },
        departamento: { select: { nome: true } },
        shopping: { select: { nome: true } },
        gestorSolicitante: { select: { id: true, nomeCompleto: true } },
        _count: { select: { candidatos: true } },
      },
      orderBy: [{ prioridade: 'desc' }, { dataAbertura: 'asc' }],
    });
  }

  async resumo() {
    const grupos = await this.prisma.vaga.groupBy({
      by: ['status'],
      _count: { _all: true },
    });
    return grupos.map((g) => ({ status: g.status, total: g._count._all }));
  }

  async create(dto: CreateVagaDto) {
    // vaga nasce sempre no início do funil (ABERTA)
    return this.prisma.vaga.create({ data: { ...dto, status: 'ABERTA' } });
  }

  async avancar(id: string) {
    const vaga = await this.prisma.vaga.findUnique({ where: { id } });
    if (!vaga) throw new NotFoundException('Vaga não encontrada');
    if (vaga.status === 'CANCELADA') {
      throw new BadRequestException('Vaga cancelada não pode avançar');
    }
    const idx = FLUXO.indexOf(vaga.status);
    if (idx < 0 || idx >= FLUXO.length - 1) {
      throw new BadRequestException('Vaga já está na etapa final do funil');
    }
    return this.prisma.vaga.update({
      where: { id },
      data: { status: FLUXO[idx + 1] },
    });
  }

  async cancelar(id: string) {
    const vaga = await this.prisma.vaga.findUnique({ where: { id } });
    if (!vaga) throw new NotFoundException('Vaga não encontrada');
    return this.prisma.vaga.update({
      where: { id },
      data: { status: 'CANCELADA' },
    });
  }
}
