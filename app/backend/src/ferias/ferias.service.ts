import { Injectable } from '@nestjs/common';
import { Prisma, StatusFerias } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface FiltroFerias {
  colaboradorId?: string;
  status?: StatusFerias;
}

@Injectable()
export class FeriasService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filtro: FiltroFerias) {
    const where: Prisma.FeriasWhereInput = {};
    if (filtro.colaboradorId) where.colaboradorId = filtro.colaboradorId;
    if (filtro.status) where.status = filtro.status;

    return this.prisma.ferias.findMany({
      where,
      include: {
        colaborador: {
          select: {
            id: true,
            nomeCompleto: true,
            matricula: true,
            departamento: { select: { nome: true } },
          },
        },
      },
      orderBy: [{ status: 'asc' }, { periodoAquisitivoFim: 'asc' }],
    });
  }

  async resumo() {
    const grupos = await this.prisma.ferias.groupBy({
      by: ['status'],
      _count: { _all: true },
    });
    return grupos.map((g) => ({ status: g.status, total: g._count._all }));
  }
}
