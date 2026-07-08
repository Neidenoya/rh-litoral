import { Injectable } from '@nestjs/common';
import { Prisma, StatusTreinamento } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface FiltroMatricula {
  status?: StatusTreinamento;
  colaboradorId?: string;
}

@Injectable()
export class TreinamentosService {
  constructor(private readonly prisma: PrismaService) {}

  async catalogo() {
    return this.prisma.treinamento.findMany({
      include: { _count: { select: { colaboradores: true } } },
      orderBy: { nome: 'asc' },
    });
  }

  async matriculas(filtro: FiltroMatricula) {
    const where: Prisma.ColaboradorTreinamentoWhereInput = {};
    if (filtro.status) where.status = filtro.status;
    if (filtro.colaboradorId) where.colaboradorId = filtro.colaboradorId;

    return this.prisma.colaboradorTreinamento.findMany({
      where,
      include: {
        treinamento: { select: { nome: true, tipo: true } },
        colaborador: {
          select: { id: true, nomeCompleto: true, matricula: true },
        },
      },
      orderBy: [{ status: 'asc' }, { dataVencimento: 'asc' }],
    });
  }

  async resumo() {
    const grupos = await this.prisma.colaboradorTreinamento.groupBy({
      by: ['status'],
      _count: { _all: true },
    });
    return grupos.map((g) => ({ status: g.status, total: g._count._all }));
  }
}
