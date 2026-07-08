import { Injectable } from '@nestjs/common';
import { Prisma, TipoDocumento } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface FiltroDocumento {
  colaboradorId?: string;
  tipo?: TipoDocumento;
}

@Injectable()
export class DocumentosService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filtro: FiltroDocumento) {
    const where: Prisma.DocumentoWhereInput = {};
    if (filtro.colaboradorId) where.colaboradorId = filtro.colaboradorId;
    if (filtro.tipo) where.tipo = filtro.tipo;

    return this.prisma.documento.findMany({
      where,
      include: {
        colaborador: {
          select: { id: true, nomeCompleto: true, matricula: true },
        },
      },
      orderBy: { dataUpload: 'desc' },
    });
  }
}
