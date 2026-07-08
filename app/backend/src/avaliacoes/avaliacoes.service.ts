import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface FiltroAvaliacao {
  colaboradorId?: string;
  ciclo?: string;
}

@Injectable()
export class AvaliacoesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filtro: FiltroAvaliacao) {
    const where: Prisma.AvaliacaoDesempenhoWhereInput = {};
    if (filtro.colaboradorId) where.colaboradorId = filtro.colaboradorId;
    if (filtro.ciclo) where.ciclo = filtro.ciclo;

    const lista = await this.prisma.avaliacaoDesempenho.findMany({
      where,
      include: {
        colaborador: {
          select: {
            id: true,
            nomeCompleto: true,
            matricula: true,
            cargo: { select: { nome: true } },
          },
        },
      },
      orderBy: { ciclo: 'desc' },
    });

    // Decimal → number para o frontend
    return lista.map((a) => ({
      ...a,
      notaGestor: a.notaGestor != null ? Number(a.notaGestor) : null,
      notaAutoavaliacao:
        a.notaAutoavaliacao != null ? Number(a.notaAutoavaliacao) : null,
    }));
  }
}
